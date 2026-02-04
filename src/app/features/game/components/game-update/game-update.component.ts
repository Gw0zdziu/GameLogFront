import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {DialogService, DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameService} from '../../services/game.service';
import {GameStore} from '../../store/game-store';
import {GameDto} from '../../models/game.dto';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {CategoryStore} from '../../../category/store/category-store';

@Component({
  selector: 'app-game-update',
  imports: [
    AutoComplete,
    ButtonDirective,
    ButtonLabel,
    DatePicker,
    InputText,
    Message,
    ReactiveFormsModule,
  ],
  templateUrl: './game-update.component.html',
  styleUrl: './game-update.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameUpdateComponent implements OnInit{
    private dynamicDialogRef = inject(DynamicDialogRef);
    private dialogService = inject(DialogService);
    private categoryStore = inject(CategoryStore);
    private gameService = inject(GameService);
    readonly filteredCategories = signal<CategoryDto[]>([]);
    readonly isNotSelectCategory = signal(true);
    readonly game = signal<GameDto | null>(null);
    readonly updatedGame = signal<GameDto | null>(null)
    gameStore = inject(GameStore);
    instance: DynamicDialogComponent | undefined;
    gameId: string;
    updateGameForm = new FormGroup(
      {
        gameName: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        selectedCategory: new FormControl<{
          categoryId: string;
          categoryName: string;
        } | null>(null, {
          validators: [Validators.required],
        }),
        yearPlayed: new FormControl<Date | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        })
      }
    )

    constructor() {
      this.categoryStore.getCategories();
      this.instance = this.dialogService.getInstance(this.dynamicDialogRef);
    }

    ngOnInit(): void {
      this.gameId = this.instance?.data;
      this.gameService.getGame(this.gameId).pipe(
      ).subscribe({
        next: value => {
          const category = this.categoryStore.categories().find(x => x.categoryId === value.categoryId) as CategoryDto;
          this.updateGameForm.setValue({
            gameName: value.gameName,
            selectedCategory: {
              categoryId: category.categoryId,
              categoryName: category.categoryName
            },
            yearPlayed: new Date(value.yearPlayed)
          })
        }
      });
    }

  filterCategory($event: AutoCompleteCompleteEvent): void {
    this.filteredCategories.set(this.categoryStore.categories()
      .filter(category => category.categoryName.toLowerCase().includes( $event.query.toLowerCase())));
    this.isNotSelectCategory.set(this.filteredCategories().length === 0);

  }
  selectCategory() : void{
    this.isNotSelectCategory.set(true);
  }

  submitUpdateGame(): void  {
      const updatedGame = this.updateGameForm.getRawValue();
    this.gameStore.updateGame({
      gameId: this.gameId as string,
      updatedGame: {
        gameName: updatedGame.gameName,
        categoryId: (updatedGame.selectedCategory as CategoryDto).categoryId,
        yearPlayed: updatedGame.yearPlayed
      },
      onSuccess: () => {
        this.dynamicDialogRef.close(true);
      }
    })
  }
}
