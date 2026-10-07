import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {LoginUserDto} from '../models/login-user.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {UserStore} from '../../../core/store/user-store/user-store';
import {ToastService} from '../../../shared/services/toast/toast.service';
import {TokenStoreService} from '../../../core/store/token-store/token-store.service';
import {LoggedStoreService} from '../../../core/store/logged-store/logged-store.service';
import {LoginResponseDto} from '../models/login-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);
  private loggedStoreService = inject(LoggedStoreService);
  private userStore = inject(UserStore);
  private toastService = inject(ToastService);
  private authStoreService = inject(TokenStoreService);


  constructor() {

  }


  loginUser(loginUser: LoginUserDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/login`, loginUser, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, false),
    }).pipe(
      tap(value => {
        this.authStoreService.setToken(value.token);
        this.loggedStoreService.setLogged(true);
        this.toastService.showSuccess('auth.successfully-login');
      }),
      catchError((err: HttpErrorResponse) => {
        this.authStoreService.setToken(null)
        this.loggedStoreService.setLogged(false);
        return throwError(() => err)
      }),
    );
  }

  refreshToken(): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/refresh-token`, {}, {
      withCredentials: true,
      responseType: 'text',
      context: new HttpContext().set(IS_AUTH_REQUIRED, true),

    })
  }

   logoutUser(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/logout`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      tap(() => {
      this.userStore.cleanStore();
      this.loggedStoreService.setLogged(false);
      this.authStoreService.clearToken();
      }),
      catchError((err: HttpErrorResponse) => {
        this.userStore.cleanStore();
        this.loggedStoreService.setLogged(false);
        this.authStoreService.clearToken();
        return throwError(() => err);
      }));
  }

  isTokenValid() {
    const token = this.authStoreService.token$();
    if (!token) return false;

    const payload = this.decodeJwtPayload(token);
    if (!payload) return false;

    const exp = Number(payload.exp);
    if (!Number.isFinite(exp)) return false;

    const bufferInSeconds = 30;
    const expiresAtMs = (exp - bufferInSeconds) * 1000;

    return Date.now() < expiresAtMs;
  }

  private decodeJwtPayload(token: string): { exp?: number } | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);

      return JSON.parse(json);
    } catch {
      return null;
    }
  }


}
