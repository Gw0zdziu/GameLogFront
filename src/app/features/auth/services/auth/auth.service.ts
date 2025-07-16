import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RegisterNewUserRequestDto} from '../../../shared/models/request/register-new-user-request.dto';
import {LoginUserDto} from '../../../shared/models/request/login-user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/account`
  private httpClient = inject(HttpClient);

  registerNewUser(registerNewUser: RegisterNewUserRequestDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/register`, registerNewUser);
  }

  loginUser(loginUser: LoginUserDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/login`, loginUser, {
      responseType: 'text'
    });
  }
}
