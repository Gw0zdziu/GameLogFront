import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Message} from 'primeng/message';
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {DatePicker} from 'primeng/datepicker';
import {CategoryStore} from '../../../category/store/category-store';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {UserStoreService} from '../../../../core/store/user-store/user-store.service';
import {GamebrainapiService} from '../../services/gamebrainapi/gamebrainapi.service';
import {GameDetailsDto} from '../../models/game-details.dto';
import {ImageGameComponent} from '../shared/image-game/image-game.component';

export interface EventSelect<T> extends  AutoCompleteSelectEvent{
  image: string;
  value: T;
}


@Component({
  selector: 'app-game-add',
  imports: [
    Message,
    AutoComplete,
    DatePicker,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonLabel,
    ImageGameComponent
  ],
  templateUrl: './game-add.component.html',
  styleUrl: './game-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameAddComponent implements  OnInit{
    private defaultGameImage = './g'
    private dynamicDialogRef = inject(DynamicDialogRef);
    private categoryStore = inject(CategoryStore);
    private userStoreService = inject(UserStoreService);
    private formBuilder = inject(FormBuilder);
    private gameBrainApiService = inject(GamebrainapiService);
    gameStore = inject(GameStore);
    readonly games = signal<GameDetailsDto[]>([]);
    readonly isNotSelectCategory = signal(true);
    readonly filteredCategories = signal<CategoryDto[]>([]);
    newGameForm = this.formBuilder.group({
      gameName: ['', {
        validators: [Validators.required],
        nullable: true,
        blur: true,
      }],
      categoryId: ['', {
        validators: [Validators.required],
        blur: true,
      }],
      yearPlayed: [new Date(), {
        validators: [],
      }],
      gameImage: new FormControl<string>('', {
        nonNullable: true
      })
    })



  ngOnInit(): void {
    const userId = this.userStoreService.user$()?.userId as string;
    this.categoryStore.getCategoriesByUserId(userId);
  }

  filterCategory($event: AutoCompleteCompleteEvent): void {
    this.filteredCategories.set(this.categoryStore.categories()
      .filter(category => category.categoryName.toLowerCase().includes( $event.query.toLowerCase())));
    this.isNotSelectCategory.set(this.filteredCategories().length === 0);

  }



  selectCategory(event:  AutoCompleteSelectEvent) : void{
    this.isNotSelectCategory.set(true);
  }

  submitNewGame(): void{
     this.gameStore.postGame({
       newGame: {
         gameName: this.newGameForm.get('gameName')?.getRawValue() as string,
         gameImageUrl: this.newGameForm.get('gameImage')?.getRawValue() as string,
         categoryId: this.newGameForm.get('categoryId')?.getRawValue()?.categoryId as string,
         yearPlayed: this.newGameForm.get('yearPlayed')?.value as Date
       },
       onSuccess: () => {
         this.dynamicDialogRef.close(true);
       }
     });
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
      this.newGameForm.controls.gameName.reset();
      this.newGameForm.controls.gameImage.reset();
    }
  }

  selectGame(event: AutoCompleteSelectEvent): void {
    this.newGameForm.patchValue({
      gameName: event.value.name,
      gameImage: event.value.image
    })
  }

  removeSelectGame(): void {
    this.newGameForm.controls.gameImage.reset();
    this.newGameForm.controls.gameName.reset();
  }


}
