import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {PaginationConfig} from '../../models/pagination-config';
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight, faUser } from "@fortawesome/free-solid-svg-icons";
import {ButtonDirective} from 'primeng/button';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-paginator',
  imports: [
    ButtonDirective,
    FaIconComponent,
    Select

  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  readonly paginationConfig = input.required<PaginationConfig>()
  readonly pageSizes = input.required<number[]>();
  readonly pageNumberChange = output<number>()
  readonly pageSizeChange = output<number>()
  readonly pagination = computed(() => {
    let pages: number[];
    let firstPage: number;
    let lastPage: number;
    const selectedPageIndex = this.paginationConfig().amountPagesList.indexOf(this.paginationConfig().pageNumber);
    if (this.paginationConfig().amountPagesList.length === 1){
      pages = [...this.paginationConfig().amountPagesList]
      return pages;
    } else {
      if (this.paginationConfig().pageNumber ===1) {
        pages = [...this.paginationConfig().amountPagesList.slice(0, 2)]
      } else if (this.paginationConfig().pageNumber === this.paginationConfig().amountPagesList.length) {
        pages = [...this.paginationConfig().amountPagesList.slice(-2)]
      } else {
        firstPage = this.paginationConfig().amountPagesList[selectedPageIndex - 1];
        lastPage = this.paginationConfig().amountPagesList[selectedPageIndex + 1];
        return pages = [firstPage, this.paginationConfig().pageNumber, lastPage]
      }
    }
    return pages;
  });
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faAnglesLeft = faAnglesLeft;
  faAnglesRight = faAnglesRight;
  selectPage($event: Event): void {
    const value = ($event.target as HTMLInputElement).value;
    this.paginationConfig().pageNumber = Number(value);
    this.pageNumberChange.emit(Number(value));
  }

  selectPageSize($event: Event): void {
    const value = Number(($event.target as HTMLInputElement).value);
    this.paginationConfig().pageNumber = 1;
    this.pageSizeChange.emit(value);
  }

  selectLastPage(): void {
    const lastIndexPage = this.paginationConfig().amountPagesList.length;
    this.paginationConfig().pageNumber = lastIndexPage
    this.pageNumberChange.emit(lastIndexPage);

  }

  selectFirstPage(): void {
    const firstIndexPage = this.paginationConfig().amountPagesList[0];
    this.paginationConfig().pageNumber = firstIndexPage
    this.pageNumberChange.emit(firstIndexPage);
  }

  selectPreviousPage(): void {
    if (this.paginationConfig().pageNumber > 1) {
      const numberPage = this.paginationConfig().pageNumber - 1;
      this.pageNumberChange.emit(numberPage);
    }
  }

  selectNextPage(): void {
    if (this.paginationConfig().pageNumber < this.paginationConfig().amountPagesList.length){
      const numberPage = this.paginationConfig().pageNumber + 1;
      this.pageNumberChange.emit(numberPage);
    }
  }
}
