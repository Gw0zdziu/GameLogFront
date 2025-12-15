import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameTableComponent} from './game-table.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {GameStore} from '../../store/game-store';
import {signal} from '@angular/core';
import {Actions} from '../../../../shared/models/actions';
import {GameDto} from '../../models/game.dto';
import {Subject} from 'rxjs';

describe('GameTableComponent', () => {
  let component: GameTableComponent;
  let fixture: ComponentFixture<GameTableComponent>;
  let dialogServiceMock: jest.Mocked<Partial<DialogService>>;
  let confirmServiceMock: jest.Mocked<Partial<ConfirmationService>>;
  let dynamicDialogRefMock: jest.Mocked<Partial<DynamicDialogRef>>;
  const dynamicDialogRefSubject = new Subject<unknown>();
  const gameStoreMock ={
    getGames: jest.fn(),
    deleteGame: jest.fn(),
    games$: signal([]),
    isLoading: signal(false)
  }
  const game: GameDto = {
    gameId: 'gameId',
    gameName: 'gameName',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: '2023-08-15T10:30:00.000Z',
    updatedDate: '2024-11-28T14:45:22.000Z',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };

  beforeEach(async () => {
    confirmServiceMock = {
      confirm: jest.fn(),

    }
    dialogServiceMock = {
      open: jest.fn().mockReturnValue(dynamicDialogRefMock),
    }
    dynamicDialogRefMock = {
      onClose: dynamicDialogRefSubject.asObservable(),
    }
    await TestBed.configureTestingModule({
      imports: [GameTableComponent],
      providers: [
        {
          provide: DialogService,
          useValue: dialogServiceMock
        },
        {
          provide: ConfirmationService,
          useValue: confirmServiceMock
        },
        {
          provide: GameStore,
          useValue: gameStoreMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should action of delete called deleteGame', () => {
    jest.spyOn(component, 'deleteGame').mockReturnValue();
    const actions = component.columns().find(column => column.columnType === 'action')?.actions as Actions<GameDto>[];
    actions[0].action(game);
    expect(component.deleteGame).toHaveBeenCalled();
  });

  it('should action of edit called updateGame', () => {
    jest.spyOn(component, 'updateGame').mockReturnValue();
    const actions = component.columns().find(column => column.columnType === 'action')?.actions as Actions<GameDto>[];
    actions[1].action(game);
    expect(component.updateGame).toHaveBeenCalled();
  })


  describe('deleteGame', () => {
    beforeEach(() => {
      component.deleteGame('1');
    })

    it('should called confirm method when called deleteGame method', () => {
      expect(confirmServiceMock.confirm).toHaveBeenCalled();
    });

    it('should called confirm method with correct configuration', () => {
      const confirmConfig = (confirmServiceMock.confirm as jest.Mock).mock.calls[0][0];
      expect(confirmConfig.message).toBe('Czy chcesz usunąć grę?');
      expect(confirmConfig.header).toBe('Usuwanie gry');
      expect(confirmConfig.icon).toBe('pi pi-exclamation-triangle');

      expect(confirmConfig.rejectButtonProps.label).toBe('Anuluj');
      expect(confirmConfig.rejectButtonProps.severity).toBe('secondary');
      expect(confirmConfig.rejectButtonProps.outlined).toBe(true);

      expect(confirmConfig.acceptButtonProps.label).toBe('Usuń');
      expect(confirmConfig.acceptButtonProps.severity).toBe('danger');
    });

    it('should called deleteGame when called accept from confirmation config', () => {
      const confirmConfig = (confirmServiceMock.confirm as jest.Mock).mock.calls[0][0];
      confirmConfig.accept();
      expect(gameStoreMock.deleteGame).toHaveBeenCalled();
    });
  })

  describe('updateGame', () => {
    beforeEach(() => {
      component.updateGame('1');
    })

    it('should called open method when called updateGame method', () => {
      expect(dialogServiceMock.open).toHaveBeenCalled();
    })

    it('should onClose called', () => {
      expect(dynamicDialogRefMock.onClose).toBeDefined();
    });

    it('should return null when onClose return false', () => {
      dynamicDialogRefSubject.next(false);
      dynamicDialogRefMock.onClose?.subscribe((value: boolean) => {
        expect(value).toBeNull();
      });
    });
  })
});
