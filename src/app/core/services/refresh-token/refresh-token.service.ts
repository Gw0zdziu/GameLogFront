import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {finalize, Observable, shareReplay} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private apiUrl = `${environment.apiUrl}/auth`
  private httpClient = inject(HttpClient);
  private isRefreshed$: Observable<string> | null = null

  refreshToken(): Observable<string> {
    if (!this.isRefreshed$) {
      this.isRefreshed$ = this.httpClient.post(`${this.apiUrl}/refresh-token`, {}, {
        withCredentials: true,
        responseType: 'text'
      }).pipe(
        finalize(() => this.isRefreshed$ = null),
        shareReplay(1)
      );
    }
    return this.isRefreshed$;
  }
}
