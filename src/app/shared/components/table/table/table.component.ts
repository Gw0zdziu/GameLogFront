import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Column} from '../../../models/column';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {ProgressSpinner} from 'primeng/progressspinner';


@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    Button,
    ProgressSpinner,
  ],

  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  readonly tableData = input.required<T[]>();
  readonly columns = input.required<Column<T>[]>();
  readonly loading = input.required();
}
