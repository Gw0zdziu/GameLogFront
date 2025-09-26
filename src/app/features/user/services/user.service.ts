import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {RecoveryUpdatePasswordDto} from '../../auth/models/recovery-update-password.dto';
import {RegisterNewUserRequestDto} from '../models/register-new-user-request.dto';
import {ConfirmCodeDto} from '../models/confirm-code.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {UserStoreService} from '../../../core/store/user-store/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`
  private httpClient = inject(HttpClient);
  private userStoreService = inject(UserStoreService);

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

  getUser(): Observable<GetUserDto> {
    return this.httpClient.get<GetUserDto>(`${this.apiUrl}/get-user`,{
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    }).pipe(
      map(value => {
        this.userStoreService.updateUser(value);
        return value;
      })
    );
  }

  recoveryPassword(userEmail: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recovery-password`, {userEmail});
  }

  recoveryUpdatePassword(recoveryUpdatePasswordDto: RecoveryUpdatePasswordDto): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/recovery-update-password`, recoveryUpdatePasswordDto);
  }
}
