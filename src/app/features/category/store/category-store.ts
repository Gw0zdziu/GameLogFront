import {CategoryDto} from '../models/category.dto';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {computed, inject} from '@angular/core';
import {tapResponse} from '@ngrx/operators';
import {CategoryService} from '../services/category.service';
import {CategoryPostDto} from '../models/category-post.dto';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from '../../../core/services/toast/toast.service';
import {CategoryPutDto} from '../models/category-put.dto';
import {FormatDateDistancePipe} from '../../../core/pipes/format-date-distance.pipe';

type CategoryState = {
  categories: CategoryDto[];
  isLoading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
}

export const CategoryStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed(({categories}, formatDateDistance = inject(FormatDateDistancePipe)) => ({
    categories$ : computed(() => categories().map(x => {
      return {
        ...x,
        createdDate: formatDateDistance.transform(x.createdDate as Date),
        updatedDate: formatDateDistance.transform(x.updatedDate as Date)
      }
    }))
  })),
  withMethods((store,
               categoryService = inject(CategoryService),
               toastService = inject(ToastService)) => ({
    getCategories: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
        })),
        debounceTime(300),
        switchMap(() => {
          return categoryService.getUserCategories().pipe(
            tapResponse({
              next: (value) => {
                patchState(store, {isLoading: false, categories: value});
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
    addCategory: rxMethod<{
      newCategory: CategoryPostDto,
      onSuccess: () => void,
    }>(
      pipe(
        tap(() =>
          patchState(store, {
          isLoading: true,
        })
        ),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value)=> {
          return categoryService.createCategory(value.newCategory).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  isLoading: false,
                  categories: [...store.categories(), response]
                });
                value.onSuccess();
                toastService.showSuccess('Pomyślnie utworzono nową̨ kategorię');
              },
              error: (error: HttpErrorResponse) => {
                toastService.showError(error.error);
                patchState(store, {isLoading: false});
              },
              complete: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    deleteCategory: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {
          isLoading: true,
        })),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          return categoryService.deleteCategory(value).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  isLoading: false,
                  categories: store.categories().filter(category => category.categoryId !== value)
                });
                toastService.showSuccess('Pomyślnie usunięto kategorię');
              },
              error: (error: HttpErrorResponse) => {
                toastService.showError(error.error);
                patchState(store, {isLoading: false});
              },
              complete: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    updateCategory: rxMethod<{ category: CategoryPutDto , categoryId: string, onSuccess: () => void}>(
      pipe(
        tap(() => patchState(store,
          {
          isLoading: true,
        })),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          return categoryService.updateCategory(value.category, value.categoryId).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  isLoading: false,
                  categories: store.categories().map(category => {
                    return category.categoryId === response.categoryId ? response : category
                  })
                });
                value.onSuccess();
                toastService.showSuccess('Pomyślnie zaktualizowano kategorię');
              },
              error: (error: HttpErrorResponse) => {
                toastService.showError(error.error);
                patchState(store, {isLoading: false});
              },
              complete: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  })),
)
