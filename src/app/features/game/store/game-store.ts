import {GameDto} from '../models/game.dto';
import {getState, patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {computed, effect, inject} from '@angular/core';
import {FormatDateDistancePipe} from '../../../core/pipes/format-date-distance.pipe';
import {GameService} from '../services/game.service';
import {ToastService} from '../../../core/services/toast/toast.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {GamePostDto} from '../models/game-post.dto';
import {HttpErrorResponse} from '@angular/common/http';
import {GamePutDto} from '../models/game-put.dto';

type GameState = {
  games: GameDto[];
  isLoading: boolean;
}

const initialState: GameState = {
  games: [],
  isLoading: false
};

export const GameStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed(({games}, formatDateDistance = inject(FormatDateDistancePipe)) => ({
    games$: computed(() => games().map(x => {
      return {
        ...x,
        createdDate: formatDateDistance.transform(x.createdDate as Date),
        updatedDate: formatDateDistance.transform(x.updatedDate as Date)
      }
    }))
  })),
  withHooks({
    onInit: (store) => {
      effect(() => {
        const state = getState(store);
      });
    }
  }),
  withMethods((store, gameService = inject(GameService), toastService = inject(ToastService)) => ({
    getGames: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
          })),
        debounceTime(300),
        switchMap(() => {
          return gameService.getUserGames().pipe(
            tapResponse({
              next: (value) =>{
                patchState(store, {
                  isLoading: false,
                  games: value,
                })
              },
              error: () => {
                patchState(store, {isLoading: false});
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
                  toastService.showSuccess('Pomyślnie dodano grę');
                },
                error: (error: HttpErrorResponse) => {
                  console.log(error)
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
                toastService.showSuccess('Pomyślnie usunięto grę');
              },
              error: () => {
                patchState(store, {isLoading: false});
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
                toastService.showSuccess('Pomyślnie zaktualizowano grę');
              },
              error: (error: HttpErrorResponse) => {
                patchState(store, {isLoading: false});
                console.log(error.error)
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
