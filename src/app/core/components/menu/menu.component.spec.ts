import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MenuComponent} from './menu.component';
import {signal, WritableSignal} from '@angular/core';
import {LoggedStoreService} from '../../store/logged-store/logged-store.service';
import {ActivatedRoute} from '@angular/router';
import Mocked = jest.Mocked;


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let isLoggedSignalMock: WritableSignal<boolean>;
  let loggedStoreServiceMock: Mocked<Partial<LoggedStoreService>>;


  beforeEach(async () => {
    isLoggedSignalMock = signal(false);
    loggedStoreServiceMock = {
      isLogged$: isLoggedSignalMock.asReadonly(),
      setLogged: jest.fn((value) => isLoggedSignalMock.set(value)),
    };
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: LoggedStoreService, useValue: loggedStoreServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('')
              }
            }
          }
        }
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should menuItems has 2 when isLogged$ is true', () => {
    loggedStoreServiceMock.setLogged?.(true)
    fixture.detectChanges();
    expect(component.menuItems().length).toBe(2);
  });

  it('should menuItems has 0 when isLogged$ is false', () => {
    expect(component.menuItems().length).toBe(0);
  })

  it('should change isMenuOpen$ on true', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.isMenuOpen$()).toBeTruthy();
  });
});
