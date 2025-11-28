import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, of, tap, throwError} from 'rxjs';
import {LoginUserDto} from '../models/login-user.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {LoggedStoreService} from '../../../core/store/logged-store/logged-store.service';
import {UserStoreService} from '../../../core/store/user-store/user-store.service';
import {ToastService} from '../../../core/services/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);
  private loggedStoreService = inject(LoggedStoreService);
  private userStoreService = inject(UserStoreService);
  private toastService = inject(ToastService);


  loginUser(loginUser: LoginUserDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/login`, loginUser, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true),
      responseType: 'text'
    }).pipe(
      tap(value => {
        this.userStoreService.updateUser({token: value});
        this.loggedStoreService.setLogged(true);
        this.toastService.showSuccess('Pomyślnie zalogowano');
      }),
      catchError((err: HttpErrorResponse, caught) => {
        this.loggedStoreService.setLogged(false);
        this.toastService.showError(err.error);
        return throwError(() => err)
      }),
    );
  }

   logoutUser(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/logout`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      tap(() => {
      this.userStoreService.cleanStore();
      this.loggedStoreService.setLogged(false);
      this.toastService.showSuccess('Pomyślnie wylogowano');
      }),
      catchError((err, caught) => {
        this.userStoreService.cleanStore();
        this.loggedStoreService.setLogged(false);
        this.toastService.showSuccess('Pomyślnie wylogowano');
        return of(err)
      }),);
  }

  verify(){
    return this.httpClient.get<boolean>(`${this.apiUrl}/verify`, {
      withCredentials: true,
      context: new HttpContext()
        .set(IS_AUTH_REQUIRED, true)
    }).pipe(
      tap(() => {
        this.loggedStoreService.setLogged(true);
      }),
      catchError((err, caught) => {
        this.loggedStoreService.setLogged(false);
        return of(err)
      })
    )
  }


}
