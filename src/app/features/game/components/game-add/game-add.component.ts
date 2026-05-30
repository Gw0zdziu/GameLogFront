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
import {UserStore} from '../../../../core/store/user-store/user-store';
import {GameDetailsDto} from '../../models/game-details.dto';
import {ImageGameComponent} from '../shared/image-game/image-game.component';
import {GamebrainapiService} from "../../services/gamebrainapi/gamebrainapi.service";
import {debounceTime, distinctUntilChanged, filter, Subject, switchMap} from "rxjs";
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

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
    ImageGameComponent,
    FaIconComponent
  ],
  templateUrl: './game-add.component.html',
  styleUrl: './game-add.component.css',
  host:{
    class: 'game-dialog'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameAddComponent implements  OnInit{
    private dynamicDialogRef = inject(DynamicDialogRef);
    private categoryStore = inject(CategoryStore);
    private gameStory = inject(GameStore);
    private userStore = inject(UserStore);
    private formBuilder = inject(FormBuilder);
    private gameBrainService = inject(GamebrainapiService);
    gameStore = inject(GameStore);
    readonly games = signal<GameDetailsDto[]>([]);
    readonly isNotSelectCategory = signal(true);
    readonly filteredCategories = signal<CategoryDto[]>([]);
    private gameNameSearch$ = new Subject<string>();
    faSpinner = faSpinner;
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
    const userId = this.userStore.userId() as string;
    this.categoryStore.getCategoriesByUserId(userId);
    this.gameNameSearch$.pipe(
        filter(query => query !== ''),
        debounceTime(1000),
        switchMap(query => this.gameBrainService.getGames(query)),
        distinctUntilChanged(),
    ).subscribe(query => {
      this.games.set(query);
      if (query.length === 0) {
        this.newGameForm.controls.gameImage.setValue('')
      }
    })
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
     this.gameStore.postGame({
       newGame: {
         gameName: this.newGameForm.get('gameName')?.getRawValue() as string,
         gameImageUrl: this.newGameForm.get('gameImage')?.getRawValue() as string,
         categoryId: this.newGameForm.get('categoryId')?.getRawValue()?.categoryId as string,
         yearPlayed: this.newGameForm.get('yearPlayed')?.value as Date
       },
       onSuccess: () => {
         this.gameStory.getGames(null);
         this.dynamicDialogRef.close(true);
       }
     });
  }


  filterGames(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase()
      this.gameNameSearch$.next(query);
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
