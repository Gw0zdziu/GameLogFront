import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginUserDto} from '../../../shared/models/request/login-user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);

  loginUser(loginUser: LoginUserDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/login`, loginUser, {
      responseType: 'text'
    });
  }


}
