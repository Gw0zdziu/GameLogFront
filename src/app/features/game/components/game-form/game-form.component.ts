import {ChangeDetectionStrategy, Component, effect, inject, input, OnInit, output, signal} from '@angular/core';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryDto} from '../../../category/models/category.dto';
import {CategoryStore} from '../../../category/store/category-store';
import {GameBaseDto} from '../../models/game-base.dto';
import {Message} from 'primeng/message';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {GameStore} from '../../store/game-store';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameFormComponent<T extends GameBaseDto> implements OnInit{
  private categoryStore = inject(CategoryStore);
  gameStore = inject(GameStore);
  updatedGame = input.required<T | null>();
  gameName = signal('');
  selectedCategory = signal<CategoryDto | null>(null);
  filteredCategories = signal<CategoryDto[]>([]);
  onSubmit = output<T>();


  constructor() {
    effect(() => {
      this.selectedCategory.set(this.categoryStore.categories().find(x => x.categoryId === this.updatedGame()?.categoryId) as CategoryDto);
      this.gameName.set(this.updatedGame()?.gameName as string)
    });
  }

  ngOnInit(): void {
    this.categoryStore.getCategories();

  }


  filterCategory($event: AutoCompleteCompleteEvent) {
    this.filteredCategories.set(this.categoryStore.categories().filter(category => category.categoryName.toLowerCase().includes( $event.query.toLowerCase())));
  }

  formSubmit() {
    const newGame = {
      gameName: this.gameName(),
      categoryId: this.selectedCategory()?.categoryId as string,
    } as T;
    this.onSubmit.emit(newGame);
  }
}
