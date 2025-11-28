import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {RecoveryUpdatePasswordDto} from '../../auth/models/recovery-update-password.dto';
import {RegisterNewUserRequestDto} from '../models/register-new-user-request.dto';
import {ConfirmCodeDto} from '../models/confirm-code.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {UserStoreService} from '../../../core/store/user-store/user-store.service';
import {ToastService} from '../../../core/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`
  private httpClient = inject(HttpClient);
  private userStoreService = inject(UserStoreService);
  private toastService = inject(ToastService);


  registerNewUser(registerNewUser: RegisterNewUserRequestDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/register`, registerNewUser, {
      responseType: 'text'
    }).pipe(
      tap((value) => {
        this.userStoreService.updateUser({userId: value});
        this.toastService.showSuccess('Udało się założyć konto');
      }),
      catchError((err, caught) => {
        this.toastService.showError(err.error);
        return throwError(() => err)
      })
    );
  }

  confirmUser(confirmCode: ConfirmCodeDto): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/confirm-user`, confirmCode)
      .pipe(
        tap(() => {
          this.toastService.showSuccess('Potwierdzono konto użytkownika');
        }),
        catchError((err, caught) => {
          this.toastService.showError(err.error);
          return throwError(() => err)
        })
      );
  }

  resendConfirmCode(userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/resend-code`, { userId: userId})
      .pipe(
        tap(() =>{
          this.toastService.showSuccess('Wysłano nowy kod potwierdzenia');
        }),
        catchError(err => {
          this.toastService.showError(err.error);
          return throwError(() => err)
        })
      );
  }

  getUser(): Observable<GetUserDto> {
    return this.httpClient.get<GetUserDto>(`${this.apiUrl}/get-user`,{
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      tap(value => {
        this.userStoreService.updateUser(value);
      })
    );
  }

  recoveryPassword(userEmail: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recovery-password`, {userEmail})
      .pipe(
        tap(() => {
          this.toastService.showSuccess('Wysłano link z odzyskiwaniem hasła');
        }),
        catchError(err => {
          this.toastService.showError(err.error);
          return throwError(() => err)
        })
      )
  }

  recoveryUpdatePassword(recoveryUpdatePasswordDto: RecoveryUpdatePasswordDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recovery-update-password`, recoveryUpdatePasswordDto)
      .pipe(
        tap(() => {
          this.toastService.showSuccess('Pomyślnie zaktualizowano hasło');
        }),
        catchError(err => {
          this.toastService.showError(err.error);
          return throwError(() => err)
        })
      )
  }
}
