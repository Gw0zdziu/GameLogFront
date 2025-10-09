import {Component, model} from '@angular/core';
import {CategoryDto} from "../../models/category.dto";
import {FormatDateDistancePipe} from '../../../../core/pipes/format-date-distance.pipe';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-category-table',
  imports: [
    FormatDateDistancePipe,
    TableModule
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css'
})
export class CategoryTableComponent {
  categories = model<CategoryDto[]>([])
}
