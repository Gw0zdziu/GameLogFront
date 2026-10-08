import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameService} from '../../services/game.service';
import {GameStore} from '../../store/game-store';
import {GameDto} from '../../models/game.dto';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {Message} from 'primeng/message';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {CategoryStore} from '../../../category/store/category-store';
import {ImageGameComponent} from "../shared/image-game/image-game.component";
import {GameDetailsDto} from "../../models/game-details.dto";
import {debounceTime, distinctUntilChanged, filter, Subject, switchMap} from 'rxjs';
import {GamebrainapiService} from '../../services/gamebrainapi/gamebrainapi.service';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {CategoryNamesDto} from "../../../category/models/category-names.dto";
import {CategoryService} from '../../../category/services/category.service';

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
    readonly filteredCategories = signal<CategoryNamesDto[]>([]);
    readonly isNotSelectCategory = signal(true);
    readonly game = signal<GameDto | null>(null);
    readonly games = signal<GameDetailsDto[]>([]);
    gameStore = inject(GameStore);
    instance: DynamicDialogComponent | undefined;
    gameId: string;
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
    )

    constructor() {
      this.instance = this.dialogService.getInstance(this.dynamicDialogRef);
    }

    ngOnInit(): void {
      this.categoryService.getCategoryNames().subscribe({
        next: value => {
          this.filteredCategories.set(value);
        }
      })
      this.gameId = this.instance?.data;
      this.gameService.getGame(this.gameId).pipe(
      ).subscribe({
        next: value => {
          this.updateGameForm.patchValue({
            gameName: value.gameName,
            gameImage: value.gameUrl,
            yearPlayed: new Date(value.yearPlayed)
          });
          const category = this.filteredCategories().find(x => x.categoryId === value.categoryId);
          if (category) {
            this.updateGameForm.controls.selectedCategory.setValue({
              categoryId: category.categoryId,
              categoryName: category.categoryName
            })
          }

        }
      });
      this.gameNameSearch$.pipe(
        filter(query => query !== ''),
        debounceTime(1000),
        switchMap(query => this.gameBrainService.getGames(query)),
        distinctUntilChanged(),
      ).subscribe(query => {
        this.games.set(query);
        if (query.length === 0) {
          this.updateGameForm.controls.gameImage.setValue('')
        }
      })
    }

  filterCategory($event: AutoCompleteCompleteEvent): void {
    this.filteredCategories.set(this.categoryStore.categories()
      .filter(category => category.categoryName.toLowerCase().includes( $event.query.toLowerCase())));
    this.isNotSelectCategory.set(this.filteredCategories().length === 0);
  }

  filterGames(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase()
    this.gameNameSearch$.next(query);
  }

  selectCategory() : void{
    this.isNotSelectCategory.set(true);
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
