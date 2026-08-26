import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home.component';
import { LayoutService } from '../../shared/services/layout/layout.service';

@Component({ selector: 'header[app-navbar]', template: '', standalone: true })
class MockNavbarComponent {}

@Component({ selector: 'app-menu', template: '', standalone: true })
class MockMenuComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const isMenuOpenSignal = signal(false);
  const layoutServiceMock = { isMenuOpen$: isMenuOpenSignal };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: LayoutService, useValue: layoutServiceMock },
        provideRouter([]),
      ],
    })
      .overrideComponent(HomeComponent, {
        set: {
          imports: [RouterOutlet, MockNavbarComponent, MockMenuComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('powinien się stworzyć', () => {
    expect(component).toBeTruthy();
  });

  it('dodaje klasę expanded gdy menu jest otwarte', () => {
    isMenuOpenSignal.set(true);
    fixture.detectChanges();
    const content: HTMLElement = fixture.nativeElement.querySelector('.content');
    expect(content.classList).toContain('expanded');
  });

  it('nie dodaje klasy expanded gdy menu jest zamknięte', () => {
    isMenuOpenSignal.set(false);
    fixture.detectChanges();
    const content: HTMLElement = fixture.nativeElement.querySelector('.content');
    expect(content.classList).not.toContain('expanded');
  });
});