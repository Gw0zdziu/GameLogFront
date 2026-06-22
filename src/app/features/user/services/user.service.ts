import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {RegisterNewUserRequestDto} from '../models/register-new-user-request.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {ToastService} from '../../../shared/services/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`
  private httpClient = inject(HttpClient);
  private toastService = inject(ToastService);


  registerNewUser(registerNewUser: RegisterNewUserRequestDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/register`, registerNewUser, {
      responseType: 'text'
    }).pipe(
      tap((value) => {
        this.toastService.showSuccess('Udało się założyć konto');
      }),
      catchError((err, caught) => {
        this.toastService.showError(err.error);
        return throwError(() => err)
      })
    );
  }

  confirmUser(userId: string, confirmCode: string): Observable<void> {
    const confirmCodeDto = {
      userId: userId,
      confirmCode: confirmCode
    }
    return this.httpClient.post<void>(`${this.apiUrl}/confirm-user`, confirmCodeDto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastService.showError(error.error);
          return throwError(() => error)
        })
      );
  }

  resendConfirmationCode(userId: string): Observable<void> {
      return this.httpClient.get<void>(`${this.apiUrl}/resend-code/${userId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.toastService.showError(error.error);
          return throwError(() => error)
        })
      );
  }

  getUser(): Observable<GetUserDto> {
    return this.httpClient.get<GetUserDto>(`${this.apiUrl}/get-user`,{
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
  }


}
