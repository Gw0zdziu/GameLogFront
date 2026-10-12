import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameService} from '../../services/game.service';
import {GameStore} from '../../store/game-store';
import {GameDto} from '../../models/game.dto';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteDropdownClickEvent,
  AutoCompleteSelectEvent
} from 'primeng/autocomplete';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {Message} from 'primeng/message';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {CategoryStore} from '../../../category/store/category-store';
import {ImageGameComponent} from "../shared/image-game/image-game.component";
import {GameDetailsDto} from "../../models/game-details.dto";
import {debounceTime, filter, forkJoin, Subject, switchMap} from 'rxjs';
import {GamebrainapiService} from '../../services/gamebrainapi/gamebrainapi.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {CategoryNamesDto} from "../../../category/models/category-names.dto";
import {CategoryService} from '../../../category/services/category.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-update',
  imports: [
    AutoComplete,
    ButtonDirective,
    ButtonLabel,
    DatePicker,
    Message,
    ReactiveFormsModule,
      ImageGameComponent,
    FaIconComponent,
  ],
  templateUrl: './game-update.component.html',
  styleUrl: './game-update.component.css',
  host:{
    class: 'game-dialog'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameUpdateComponent implements OnInit{
    private dynamicDialogRef = inject(DynamicDialogRef);
    private dialogService = inject(DialogService);
    private categoryStore = inject(CategoryStore);
    private gameService = inject(GameService);
    private categoryService = inject(CategoryService);
    private cdr = inject(ChangeDetectorRef);
    private gameBrainService = inject(GamebrainapiService)
    private gameNameSearch$ = new Subject<string>();
    readonly categories = signal<CategoryNamesDto[]>([]);
    readonly filteredCategories = signal<CategoryNamesDto[]>([]);
    readonly isNotSelectCategory = signal(true);
    readonly game = signal<GameDto | null>(null);
    readonly games = signal<GameDetailsDto[]>([]);
    gameStore = inject(GameStore);
    instance: DynamicDialogComponent | undefined;
    gameId: string = this.dialogService.getInstance(this.dynamicDialogRef).data;
    faSpinner = faSpinner;
    updateGameForm = new FormGroup(
      {
        gameName: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
          gameImage: new FormControl<string>('', {
              nonNullable: true
          }),
        selectedCategory: new FormControl<CategoryNamesDto | null>(null, {
          validators: [Validators.required],
        }),
        yearPlayed: new FormControl<Date | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        })
      }
    );

    ngOnInit(): void {
      forkJoin({
        categoryNames: this.categoryService.getCategoryNames().pipe(),
        game: this.gameService.getGame(this.gameId),
      }).subscribe(({categoryNames, game}) => {
        this.categories.set([...categoryNames]);
        this.updateGameForm.patchValue({
          gameName: game.gameName,
          gameImage: game.gameUrl,
          yearPlayed: new Date(game.yearPlayed),
        })
        const category = categoryNames.find(x => x.categoryId === x.categoryId);
        if (category) {
          this.updateGameForm.controls.selectedCategory.setValue({
            categoryId: category.categoryId,
            categoryName: category.categoryName
          })
        }
      })
      this.gameNameSearch$.pipe(
        filter(query => query !== ''),
        debounceTime(1000),
        switchMap(query => this.gameBrainService.getGames(query)),
        takeUntilDestroyed(),
      ).subscribe(query => {
        this.games.set(query);
      })
    }

  filterGames(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase()
    this.gameNameSearch$.next(query);
  }

  selectGame(event: AutoCompleteSelectEvent): void {
    this.updateGameForm.patchValue({
      gameName: event.value.name,
      gameImage: event.value.image
    })
  }

  removeSelectGame(): void {
    this.updateGameForm.controls.gameImage.reset();
    this.updateGameForm.controls.gameName.reset();
  }



  public dropdownClick($event: AutoCompleteDropdownClickEvent) {
    this.filteredCategories.set([...this.categories()]);
  }

  public completeCategories($event: AutoCompleteCompleteEvent) {
    const value = $event.query;
    if (value){
      const categories = this.categories().filter(x => x.categoryName.toLowerCase().includes(value.toLowerCase()));
      this.filteredCategories.set([...categories]);
    }
  }

  submitUpdateGame(): void  {
    const updatedGame = this.updateGameForm.getRawValue();
    this.gameStore.updateGame({
      gameId: this.gameId as string,
      updatedGame: {
        gameName: updatedGame.gameName,
        gameImageUrl: updatedGame.gameImage as string,
        categoryId: (updatedGame.selectedCategory as CategoryDto).categoryId,
        yearPlayed: updatedGame.yearPlayed
      },
      onSuccess: () => {
        this.dynamicDialogRef.close(true);
      }
    })
}
}
