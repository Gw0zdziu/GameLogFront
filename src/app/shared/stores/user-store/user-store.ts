import {computed, inject} from '@angular/core';
import {GetUserDto} from '../../../shared/models/get-user.dto';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {UserService} from '../../../features/user/services/user.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {HttpErrorResponse} from '@angular/common/http';

type UserState = {
  user: GetUserDto | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem('user') as string) || null,
}

export const UserStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed((store) => ({
    userId: computed(() => store.user()?.userId)
  })),
  withMethods((store, userService = inject(UserService)) => ({
    cleanStore(): void {
      patchState(store, initialState)
    },
    getUser: rxMethod<void>(
      pipe(
        switchMap(() => userService.getUser().pipe(
          tapResponse({
            next: (value) => {
              patchState(store, {
                user: value
              })
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          })
        ))
      )
    ),
  }))
)



