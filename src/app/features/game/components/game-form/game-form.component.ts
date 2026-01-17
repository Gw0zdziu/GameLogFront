import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {CategoryStore} from '../../../category/store/category-store';
import {Message} from 'primeng/message';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {GameStore} from '../../store/game-store';
import {GameBaseDto} from '../../models/game-base.dto';

@Component({
  selector: 'app-game-form',
  imports: [
    AutoComplete,
    FormsModule,
    ReactiveFormsModule,
    Message,
    InputText,
    ButtonDirective,
    ButtonLabel,
  ],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameFormComponent<T extends GameBaseDto> implements OnInit{
  private categoryStore = inject(CategoryStore);
  gameStore = inject(GameStore);
  readonly gameName = signal('');
  readonly selectedCategory = signal<CategoryDto | null>(null);
  readonly filteredCategories = signal<CategoryDto[]>([]);
  readonly isNotSelectCategory = signal(true);
  readonly submitEmitter = output<T>();
  readonly updatedGame = input<T | null>();
  readonly categoryInput = viewChild<NgModel>('category');


  constructor() {
    effect(() => {
      this.selectedCategory.set(this.categoryStore.categories()
        .find(x => x.categoryId === this.updatedGame()?.categoryId) as CategoryDto);
      this.gameName.set(this.updatedGame()?.gameName as string)
    });
  }



  ngOnInit(): void {
    this.categoryStore.getCategories();

  }


  filterCategory($event: AutoCompleteCompleteEvent): void {
    this.filteredCategories.set(this.categoryStore.categories()
      .filter(category => category.categoryName.toLowerCase().includes( $event.query.toLowerCase())));
    this.isNotSelectCategory.set(this.filteredCategories().length === 0);

  }

  formSubmit(): void {
    const newGame = {
      gameName: this.gameName(),
      categoryId: this.selectedCategory()?.categoryId as string,
    } as T;
    this.submitEmitter.emit(newGame);
  }

   selectCategory() : void{
     this.isNotSelectCategory.set(true);
  }


   onChangeInput(): void {
    this.isNotSelectCategory.set(typeof this.categoryInput === 'object');
  }
}
