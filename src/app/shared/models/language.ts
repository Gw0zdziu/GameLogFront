import {Locale} from 'date-fns';

export interface Language {
  langCode: string;
  langName: string;
  locale: Locale
}
