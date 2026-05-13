import {Pipe, PipeTransform} from '@angular/core';
import {getYear} from 'date-fns';


@Pipe({
  name: 'formatDate',

})
export class FormatDatePipe implements PipeTransform {

  transform(value: Date): string {
    return getYear(value).toString();
  }

}
