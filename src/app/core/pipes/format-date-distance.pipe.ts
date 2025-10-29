import {Pipe, PipeTransform} from '@angular/core';
import {formatDistance} from 'date-fns';
import {pl} from 'date-fns/locale';

@Pipe({
  name: 'formatDateDistance',

})
export class FormatDateDistancePipe implements PipeTransform {

  transform(value: Date): string {
    return formatDistance(value, new Date() , {addSuffix: true, locale: pl});
  }

}
