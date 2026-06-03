import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {RegisterNewUserRequestDto} from '../models/register-new-user-request.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {ToastService} from '../../../core/services/toast/toast.service';
import {LoggedStoreService} from '../../../core/store/logged-store/logged-store.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`
  private httpClient = inject(HttpClient);
  private loggedStoreService = inject(LoggedStoreService);
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

  getUser(): Observable<GetUserDto> {
    return this.httpClient.get<GetUserDto>(`${this.apiUrl}/get-user`,{
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
  }


}
