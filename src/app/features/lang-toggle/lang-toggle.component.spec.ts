import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LOCALE_ID, NO_ERRORS_SCHEMA} from '@angular/core';
import {LangToggleComponent} from './lang-toggle.component';
import {languages} from '../../shared/constants/languages';

describe('LangToggleComponent', () => {
  let component: LangToggleComponent;
  let fixture: ComponentFixture<LangToggleComponent>;
  let setHref: jest.Mock;
  let pathname: string;

  beforeEach(async () => {
    pathname = '/pl';
    setHref = jest.fn();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get pathname() { return pathname; },
        set href(v: string) { setHref(v); },
      },
    });

    await TestBed.configureTestingModule({
      imports: [LangToggleComponent],
      providers: [{provide: LOCALE_ID, useValue: 'pl'}],
    }).overrideComponent(LangToggleComponent, {
      set: {imports: [], schemas: [NO_ERRORS_SCHEMA]},
    }).compileComponents();

    fixture = TestBed.createComponent(LangToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exposes the full languages list', () => {
    expect(component.languages).toEqual(languages);
  });

  it('injects LOCALE_ID as activeLocale', () => {
    expect(component.activeLocale).toBe('pl');
  });

  describe('toggleLang()', () => {
    it('does nothing when langCode matches the active locale', () => {
      component.toggleLang('pl');

      expect(setHref).not.toHaveBeenCalled();
    });

    it('redirects when langCode differs from the active locale', () => {
      pathname = '/pl/games';

      component.toggleLang('en');

      expect(setHref).toHaveBeenCalledWith('/en/games');
    });

    it('strips the language prefix from the current path', () => {
      pathname = '/pl/dashboard/settings';

      component.toggleLang('en');

      expect(setHref).toHaveBeenCalledWith('/en/dashboard/settings');
    });

    it('handles a path that contains only the language prefix', () => {
      pathname = '/pl';

      component.toggleLang('en');

      expect(setHref).toHaveBeenCalledWith('/en');
    });

    it('handles a path without a language prefix', () => {
      pathname = '/dashboard';

      component.toggleLang('en');

      expect(setHref).toHaveBeenCalledWith('/en/dashboard');
    });
  });
});