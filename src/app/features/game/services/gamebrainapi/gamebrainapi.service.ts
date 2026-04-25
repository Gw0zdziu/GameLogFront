import {inject, Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameDetailsDto} from '../../models/game-details.dto';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamebrainapiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/gamebrain`

  getGames(gameName: string): Observable<GameDetailsDto[]>{
    const queryParams = new HttpParams()
      .set('query', gameName)
    return this.http.get<GameDetailsDto[]>(`${this.apiUrl}/gameName`, {params: queryParams});
  }
}
