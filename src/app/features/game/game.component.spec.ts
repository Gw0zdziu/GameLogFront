import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameComponent} from './game.component';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {FormatDatePipe} from '../../core/pipes/format-date.pipe';
import {GameService} from './services/game.service';
import {ToastService} from '../../core/services/toast/toast.service';
import {BehaviorSubject} from 'rxjs';
import {GameAddComponent} from './components/game-add/game-add.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let dialogServiceMock: jest.Mocked<Partial<DialogService>>;
  let confirmServiceMock: jest.Mocked<Partial<DialogService>>;
  let formatDateDistancePipeMock: jest.Mocked<Partial<FormatDatePipe>>;
  let gameServiceMock: jest.Mocked<Partial<DialogService>>;
  let toastServiceMock: jest.Mocked<Partial<ToastService>>;
  let dynamicDialogRefMock: jest.Mocked<Partial<DynamicDialogRef>>;
  const dynamicDialogRefSubject = new BehaviorSubject<unknown>(undefined);
  beforeEach(async () => {
    dialogServiceMock = {
      open: jest.fn().mockReturnValue(dynamicDialogRefMock),
    };
    dynamicDialogRefMock = {
      onClose: dynamicDialogRefSubject.asObservable(),
    };
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        {
          provide: ConfirmationService, useValue: confirmServiceMock,
        },
        {
          provide: FormatDatePipe, useValue: formatDateDistancePipeMock
        },
        {
          provide: GameService, useValue: gameServiceMock
        },
        {
          provide: ToastService, useValue: toastServiceMock
        }
      ]
    }).overrideComponent(GameComponent, {
      set: {
        providers: [
          { provide: DialogService, useValue: dialogServiceMock },
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openAddGameDialog()', () =>{
    beforeEach(() => {
      component.openAddGameDialog();
    })

    it('should called open method', () => {
      expect(dialogServiceMock.open).toHaveBeenCalledTimes(1);
    });

    it('should open method called with valid configuration', () => {
      const config: DynamicDialogConfig = {
        header: 'Dodaj nową kategorię',
        modal: true,
      };
      expect(dialogServiceMock.open).toHaveBeenCalledWith(GameAddComponent, config);
    });

    it('should return null from onClose', () => {
      dynamicDialogRefSubject.next(null);
      dynamicDialogRefMock.onClose?.subscribe((value: boolean) => {
        expect(value).toBeNull();
      });
    });
  })
});
