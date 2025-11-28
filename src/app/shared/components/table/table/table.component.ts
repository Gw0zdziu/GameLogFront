import {Component, input} from '@angular/core';
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
  styleUrl: './table.component.css'
})
export class TableComponent<T> {
  public tableData = input.required<T[]>();
  public columns = input.required<Column<T>[]>();
  public loading = input.required();
}
