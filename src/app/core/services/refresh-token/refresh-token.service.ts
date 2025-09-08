import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);

  refreshToken(): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/refresh-token`, {}, {
      withCredentials: true,
      responseType: 'text'
    });
  }
}
