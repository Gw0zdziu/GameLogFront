import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {LoginUserDto} from '../models/login-user.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {LoggedStoreService} from '../../../core/store/logged-store/logged-store.service';
import {UserStoreService} from '../../../core/store/user-store/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);
  private loggedStoreService = inject(LoggedStoreService);
  private userStoreService = inject(UserStoreService);

  constructor() {
  }

  loginUser(loginUser: LoginUserDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/login`, loginUser, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, false),
      responseType: 'text'
    }).pipe(
      map(value => {
        this.userStoreService.updateUser({token: value});
        this.loggedStoreService.setLogged(true);
        return value;
      }),
      catchError((err, caught) => {
        this.loggedStoreService.setLogged(false);
        return of(err)
      }),
    );
  }

   logoutUser(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/logout`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      map(() => {
      this.userStoreService.cleanStore();
      this.loggedStoreService.setLogged(false);
    }),
      catchError((err, caught) => {
        this.userStoreService.cleanStore();
        this.loggedStoreService.setLogged(false);
        return of(err)
      }),);
  }

  verify(){
    return this.httpClient.get<boolean>(`${this.apiUrl}/verify`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      map(value => {
        this.loggedStoreService.setLogged(value);
        return value;
      }),
      catchError((err, caught) => {
        this.loggedStoreService.setLogged(false);
        return of(err)
      })
    )
  }


}
