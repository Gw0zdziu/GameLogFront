import {inject, Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {getYear} from 'date-fns';
import {LangStoreService} from '../store/lang-store.service';


@Pipe({
  name: 'formatDate',

})
export class FormatDatePipe implements PipeTransform {
  private langStore = inject(LangStoreService);

  constructor(
    @Inject(LOCALE_ID) public activeLocale: string
  ) {}

  transform(value: Date): string {
    return getYear(value).toString();
  }

}
