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
import {UserStoreService} from '../../../../core/store/user-store/user-store.service';
import {ImageGameComponent} from "../shared/image-game/image-game.component";
import {GameDetailsDto} from "../../models/game-details.dto";

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
    private cdr = inject(ChangeDetectorRef);
    private userStoreService = inject(UserStoreService);
    readonly filteredCategories = signal<CategoryDto[]>([]);
    readonly isNotSelectCategory = signal(true);
    readonly game = signal<GameDto | null>(null);
    readonly games = signal<GameDetailsDto[]>([]);
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
          gameImage: new FormControl<string>('', {
              nonNullable: true
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
      const userId = this.userStoreService.user$()?.userId as string;
      this.categoryStore.getCategoriesByUserId(userId);
      this.instance = this.dialogService.getInstance(this.dynamicDialogRef);
    }

    ngOnInit(): void {
      this.gameId = this.instance?.data;
      this.gameService.getGame(this.gameId).pipe(
      ).subscribe({
        next: value => {
          const category = this.categoryStore.categories().find(x => x.categoryId === value.categoryId) as CategoryDto;
          this.cdr.detectChanges();
          this.updateGameForm.setValue({
            gameName: value.gameName,
            gameImage: value.gameUrl,
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

    filterGames(event: AutoCompleteCompleteEvent): void {
        const query = event.query.toLowerCase()
        if (!query){
            const gamesDetails: GameDetailsDto[] = [
                {
                    name: 'Battlefield 1',
                    image: 'https://img.gamebrain.co/games/988/battlefield_1_dice_2020_21.jpg'
                },
                {
                    name: 'Clair Obscur: Expedition 33',
                    image: "https://img.gamebrain.co/games/539/clair_obscur_expedition_33_sandfall_2025_4.jpg"
                },
                {
                    name: 'Grand Theft Auto V',
                    image: 'https://img.gamebrain.co/games/968/grand_theft_auto_5_rockstarnorth_2015_575.jpg'
                },
                {
                    name: "Wrong Floor",
                    image: 'https://img.gamebrain.co/games/730/wrong_floor_n4ba_2020_1.png'
                }
            ];
            this.games.set(gamesDetails);
        } else {
            this.updateGameForm.controls.gameName.reset();
            this.updateGameForm.controls.gameImage.reset();
        }
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
