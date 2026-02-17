import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpContext, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GameDto} from '../models/game.dto';
import {IS_AUTH_REQUIRED} from '../../../core/tokens/tokens';
import {GamePostDto} from '../models/game-post.dto';
import {GamePutDto} from '../models/game-put.dto';
import {PaginatedResults} from '../../../shared/models/paginated-results';
import {PaginatedQuery} from '../../../shared/models/paginated-query';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`
  private http = inject(HttpClient);


  getUserGames(paginatedQuery: PaginatedQuery): Observable<PaginatedResults<GameDto>>{
    const query = new HttpParams()
      .set('pageNumber', paginatedQuery.pageNumber)
      .set('pageSize', paginatedQuery.pageSize)
    return this.http.get<PaginatedResults<GameDto>>(`${this.apiUrl}/get-games`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true),
      params: query
    })
   }

   deleteGame(gameId: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/delete/${gameId}`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
   }

   createGame(game: GamePostDto): Observable<GameDto>{
      return this.http.post<GameDto>(`${this.apiUrl}/create-game`, game, {
        withCredentials: true,
        context: new HttpContext().set(IS_AUTH_REQUIRED, true)
      })
   }

   updateGame(updatedGame: GamePutDto,gameId: string): Observable<GameDto>{
    return this.http.put<GameDto>(`${this.apiUrl}/update/${gameId}`, updatedGame, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
   }

  getGame(gameId: string): Observable<GameDto>{
    return this.http.get<GameDto>(`${this.apiUrl}/get-game/${gameId}`, {
      withCredentials: true,
      context: new HttpContext().set(IS_AUTH_REQUIRED, true)
    })
  }
}
