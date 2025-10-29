import {Component, input, model} from '@angular/core';
import {Column} from '../../../models/column';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';


@Component({
  selector: 'app-table',
  imports: [
    TableModule,
    Button,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T> {
  public tableData = model<T[]>([]);
  public columns = input<Column<T>[]>();
}
