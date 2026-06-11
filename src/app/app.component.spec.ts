import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { ThemeStoreService, ThemeStore } from './core/store/theme-store/theme-store.service';

@Component({ selector: 'p-toast', template: '', standalone: true })
class MockToast {}

@Component({ selector: 'p-confirmdialog', template: '', standalone: true })
class MockConfirmDialog {}

describe('AppComponent', () => {
  const defaultTheme: ThemeStore = { theme: 'light', isDark: false, icon: 'sun' };
  const themeStoreMock = {
    theme$: () => defaultTheme,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ThemeStoreService, useValue: themeStoreMock },
        provideRouter([]),
      ],
    })
      .overrideComponent(AppComponent, {
        set: {
          imports: [RouterOutlet, MockToast, MockConfirmDialog],
        },
      })
      .compileComponents();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'GameLogFront' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('GameLogFront');
  });

  it('ustawia atrybut dark-theme na elemencie html przy inicjalizacji', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const html = document.documentElement;
    expect(html.getAttribute('dark-theme')).toBe('light');
  });
});
