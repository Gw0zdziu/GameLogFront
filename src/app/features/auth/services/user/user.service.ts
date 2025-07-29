import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {RegisterNewUserRequestDto} from '../../../shared/models/request/register-new-user-request.dto';
import {Observable} from 'rxjs';
import {ConfirmCodeDto} from '../../../shared/models/request/confirm-code.dto';
import {GetUserDto} from '../../../shared/models/response/get-user.dto';
import {RecoveryUpdatePasswordDto} from '../../../shared/models/request/recovery-update-password.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`
  private httpClient = inject(HttpClient);

  registerNewUser(registerNewUser: RegisterNewUserRequestDto): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/register`, registerNewUser, {
      responseType: 'text'
    });
  }

  confirmUser(confirmCode: ConfirmCodeDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/confirm-user`, confirmCode);
  }

  resendConfirmCode(userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/resend-code`, { userId: userId});
  }

  getUser(userId: string): Observable<GetUserDto> {
    return this.httpClient.get<GetUserDto>(`${this.apiUrl}/get-user/${userId}`);
  }

  recoveryPassword(userEmail: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recovery-password`, {userEmail});
  }

  recoveryUpdatePassword(recoveryUpdatePasswordDto: RecoveryUpdatePasswordDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recovery-update-password`, recoveryUpdatePasswordDto);
  }
}
