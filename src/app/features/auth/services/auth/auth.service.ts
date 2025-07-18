import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginUserDto} from '../../../shared/models/request/login-user.dto';
import {LoginResponseDto} from '../../../shared/models/response/login-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);

  loginUser(loginUser: LoginUserDto): Observable<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>(`${this.apiUrl}/login`, loginUser);
  }

   logoutUser(userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/logout/${userId}`);
  }


}
