import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { pl } from 'date-fns/locale/pl';
import { enGB } from 'date-fns/locale/en-GB';
import { LangStoreService } from './lang-store.service';
import { languages } from '../../shared/constants/languages';

describe('LangStoreService', () => {
  function createService(localeId: string): LangStoreService {
    TestBed.configureTestingModule({
      providers: [
        LangStoreService,
        { provide: LOCALE_ID, useValue: localeId },
      ],
    });
    return TestBed.inject(LangStoreService);
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    it('sets activeLang to Polish when LOCALE_ID is "pl"', () => {
      const service = createService('pl');

      expect(service.activeLang.langCode).toBe('pl');
      expect(service.activeLang.locale).toBe(pl);
    });

    it('sets activeLang to English when LOCALE_ID is "en"', () => {
      const service = createService('en');

      expect(service.activeLang.langCode).toBe('en');
      expect(service.activeLang.locale).toBe(enGB);
    });

    it('defaults to first language (Polish) when LOCALE_ID does not match any language', () => {
      const service = createService('de');

      expect(service.activeLang).toEqual(languages[0]);
      expect(service.activeLang.langCode).toBe('pl');
    });

    it('exposes activeLocale matching the provided LOCALE_ID', () => {
      const service = createService('en');

      expect(service.activeLocale).toBe('en');
    });
  });
});
