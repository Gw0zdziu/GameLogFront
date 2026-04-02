import {GameDto} from '../models/game.dto';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {GameService} from '../services/game.service';
import {ToastService} from '../../../core/services/toast/toast.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {GamePostDto} from '../models/game-post.dto';
import {HttpErrorResponse} from '@angular/common/http';
import {GamePutDto} from '../models/game-put.dto';
import {PaginatedQuery} from '../../../shared/models/paginated-query';
import {PaginationConfig} from '../../../shared/models/pagination-config';

type GameState = {
  games: GameDto[];
  isLoading: boolean;
  paginationState: PaginationConfig
}

const initialState: GameState = {
  games: [],
  isLoading: false,
  paginationState: {
    pageNumber: 1,
    pageSize: 5,
    amountPagesList: []
  }
};

export const GameStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, gameService = inject(GameService), toastService = inject(ToastService)) => ({
    setGameState(state: GameState): void {
      patchState(store, state);
    },
    getGames: rxMethod<PaginatedQuery>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
          })),
        debounceTime(300),
        switchMap(x => {
          return gameService.getUserGames(x).pipe(
            tapResponse({
              next: (value) =>{
                const paginationState: PaginationConfig = {
                  pageNumber: value.pageNumber,
                  pageSize: value.pageSize,
                  amountPagesList: value.amountPagesList,
                }
                patchState(store, {
                  isLoading: false,
                  games: value.results,
                  paginationState: paginationState
                });
              },
              error: (error: HttpErrorResponse) => {
                console.log(error)
                patchState(store, {isLoading: false});
                toastService.showError(error.error);
              },
              complete: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    postGame: rxMethod<{
      newGame: GamePostDto, onSuccess: () => void,
    }>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
        })),
        debounceTime(300),
        switchMap(value => {
          return gameService.createGame(value.newGame)
            .pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, {
                    isLoading: false,
                    games: [...store.games(), response]
                  })
                  value.onSuccess();
                  toastService.showSuccess($localize`Pomyślnie dodano grę`);
                },
                error: (error: HttpErrorResponse) => {
                  patchState(store, {isLoading: false});
                  toastService.showError(error.error);
                },
                complete: () => patchState(store, {isLoading: false}),
              })
            )
        })
      )
    ),
    deleteGame: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
        })),
        debounceTime(300),
        switchMap(x => {
          return gameService.deleteGame(x).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  isLoading: false,
                  games: store.games().filter(game => game.gameId !== x)
                });
                toastService.showSuccess($localize`Pomyślnie usunięto grę`);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, {isLoading: false});
                toastService.showError(error.error);
              },
              complete: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    updateGame: rxMethod<{
      updatedGame: GamePutDto,
      gameId: string
      onSuccess: () => void,
    }>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
        })),
        debounceTime(300),
        switchMap(value => {
          return gameService.updateGame(value.updatedGame, value.gameId).pipe(
            tapResponse({
              next: response => {
                patchState(store, {
                  isLoading: false,
                  games: store.games().map(x => {
                    return x.gameId === value.gameId ? response : x
                  })
                })
                value.onSuccess();
                toastService.showSuccess($localize`Pomyślnie zaktualizowano grę`);
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, {isLoading: false});
                toastService.showError(error.error);
              },
              complete: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    )
    })
  )
)
