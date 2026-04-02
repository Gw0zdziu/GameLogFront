import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {PaginationConfig} from '../../models/pagination-config';

@Component({
  selector: 'app-paginator',
  imports: [

  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {
  readonly paginationConfig = input.required<PaginationConfig>()
  readonly pageSizes = input.required<number[]>();
  readonly pageNumberChange = output<number>()
  readonly pageSizeChange = output<number>()



  selectPage($event: Event): void {
    const value = ($event.target as HTMLInputElement).value;
    this.paginationConfig().pageNumber = Number(value);
    this.pageNumberChange.emit(Number(value));
  }

  selectPageSize($event: Event): void {
    const value = Number(($event.target as HTMLInputElement).value);
    this.paginationConfig().pageSize = value;
    this.paginationConfig().pageNumber = 1;
    this.pageSizeChange.emit(value);
  }

  selectLastPage(): void {
    const lastIndexPage = this.paginationConfig().amountPagesList.length;
    this.paginationConfig().pageNumber = lastIndexPage
    this.pageNumberChange.emit(lastIndexPage);

  }

  selectFirstPage(): void {
    console.log('selectFirstPage');
    const firstIndexPage = this.paginationConfig().amountPagesList[0];
    this.paginationConfig().pageNumber = firstIndexPage
    this.pageNumberChange.emit(firstIndexPage);
  }

  selectPreviousPage(): void {
    console.log('selectPreviousPage');
    if (this.paginationConfig().pageNumber > 1) {
      this.paginationConfig().pageNumber--;
      const numberPage = this.paginationConfig().pageNumber;
      this.paginationConfig().pageNumber = numberPage
      this.pageNumberChange.emit(numberPage);
    }
  }

  selectNextPage(): void {
    if (this.paginationConfig().pageNumber < this.paginationConfig().amountPagesList.length){
      this.paginationConfig().pageNumber++
      const numberPage = this.paginationConfig().pageNumber;
      this.paginationConfig().pageNumber = numberPage
      this.pageNumberChange.emit(numberPage);
    }
  }
}
