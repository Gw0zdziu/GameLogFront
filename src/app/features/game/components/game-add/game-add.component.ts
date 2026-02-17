import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {GameStore} from '../../store/game-store';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Message} from 'primeng/message';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {DatePicker} from 'primeng/datepicker';
import {CategoryStore} from '../../../category/store/category-store';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {UserStoreService} from '../../../../core/store/user-store/user-store.service';

@Component({
  selector: 'app-game-add',
  imports: [
    Message,
    AutoComplete,
    DatePicker,
    FormsModule,
    ReactiveFormsModule,
    InputText,
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
    gameStore = inject(GameStore);
    readonly isNotSelectCategory = signal(true);
  readonly filteredCategories = signal<CategoryDto[]>([]);
  newGameForm = new FormGroup(
      {
        gameName: new FormControl(''),
        categoryId: new FormControl(''),
        yearPlayed: new FormControl(new Date())
      }
    )

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
      this.gameStore.postGame({
        newGame: {
          gameName: this.newGameForm.get('gameName')?.value as string,
          categoryId: this.newGameForm.get('categoryId')?.getRawValue()?.categoryId as string,
          yearPlayed: this.newGameForm.get('yearPlayed')?.value as Date
        },
        onSuccess: () => {
          this.dynamicDialogRef.close(true);
        }
      });
    }

}
