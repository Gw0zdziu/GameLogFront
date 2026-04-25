import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild, viewChild} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Message} from 'primeng/message';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {DatePicker} from 'primeng/datepicker';
import {CategoryStore} from '../../../category/store/category-store';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {UserStoreService} from '../../../../core/store/user-store/user-store.service';
import {debounceTime, distinctUntilChanged, filter, fromEvent, map} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GamebrainapiService} from '../../services/gamebrainapi/gamebrainapi.service';
import {GameDetailsDto} from '../../models/game-details.dto';

@Component({
  selector: 'app-game-add',
  imports: [
    Message,
    AutoComplete,
    DatePicker,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonLabel
  ],
  templateUrl: './game-add.component.html',
  styleUrl: './game-add.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameAddComponent implements  OnInit{
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
      gameName: [null, {
        validators: [Validators.required, Validators.minLength(3)],
        blur: true,
      }],
      categoryId: ['', {
        validators: [Validators.required],
        blur: true,
      }],
      yearPlayed: [new Date(), {
        validators: [],
      }]
    })
    game: any | undefined;



  ngOnInit(): void {
    const userId = this.userStoreService.user$()?.userId as string;
    this.categoryStore.getCategoriesByUserId(userId);
  }

  filterCategory($event: AutoCompleteCompleteEvent): void {
    this.filteredCategories.set(this.categoryStore.categories()
      .filter(category => category.categoryName.toLowerCase().includes( $event.query.toLowerCase())));
    this.isNotSelectCategory.set(this.filteredCategories().length === 0);

  }



  selectCategory() : void{
    this.isNotSelectCategory.set(true);
  }

  submitNewGame(): void{
    /* this.gameStore.postGame({
       newGame: {
         gameName: this.newGameForm.get('gameName')?.value as string,
         categoryId: this.newGameForm.get('categoryId')?.getRawValue()?.categoryId as string,
         yearPlayed: this.newGameForm.get('yearPlayed')?.value as Date
       },
       onSuccess: () => {
         this.dynamicDialogRef.close(true);
       }
     });*/
  }


  filterGames(event: AutoCompleteCompleteEvent): void {
    const data: GameDetailsDto[] = [
      {
        image: 'https://img.gamebrain.co/games/792/battlefield_6_battlefield_2025_110.jpg',
        name: 'Battlefield 6',
      },
      {
        image: 'https://img.gamebrain.co/games/792/battlefield_6_battlefield_2025_110.jpg',
        name: 'Battlefield 6',
      }
    ];
    this.games.set(data);
   /* this.gameBrainApiService.getGames(event.query).subscribe(data => {
          this.games.set(data);
        })*/
  }

}
