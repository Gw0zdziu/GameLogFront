import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {enGB} from 'date-fns/locale/en-GB';
import {pl} from 'date-fns/locale/pl';
import {Locale} from 'date-fns';
import {Language} from '../../shared/models/language';
import {languages} from '../../shared/constants/languages';

@Injectable({
  providedIn: 'root'
})
export class LangStoreService {
  constructor(
    @Inject(LOCALE_ID) public activeLocale: string
  ) {
    this.activeLang = languages.find(x => x.langCode === this.activeLocale )?? languages[0];
  }


   activeLang: Language;



}
