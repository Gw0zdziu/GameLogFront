import {Language} from '../models/language';
import {enGB} from 'date-fns/locale/en-GB';
import {pl} from 'date-fns/locale/pl';

export  const languages: Language[]  = [
  {
    langCode: 'pl',
    langName: $localize`Polski`,
    locale: pl
  },
  {
    langCode: 'en',
    langName: $localize`Angielski`,
    locale: enGB
  }
]
