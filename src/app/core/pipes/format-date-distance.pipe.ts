import {inject, Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {formatDistance} from 'date-fns';
import {pl} from 'date-fns/locale/pl';
import {LangStoreService} from '../store/lang-store.service';


@Pipe({
  name: 'formatDateDistance',

})
export class FormatDateDistancePipe implements PipeTransform {
  private langStore = inject(LangStoreService);

  constructor(
    @Inject(LOCALE_ID) public activeLocale: string
  ) {}

  transform(value: Date): string {
    const activeLang = this.langStore.activeLang
    return formatDistance(value, new Date() , {addSuffix: true, locale: activeLang.locale});
  }

}
