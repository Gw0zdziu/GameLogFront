import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GameUpdateComponent} from './game-update.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameStore} from '../../store/game-store';
import {GameService} from '../../services/game.service';
import {Subject} from 'rxjs';
import {GamePutDto} from '../../models/game-put.dto';
import {GameDto} from '../../models/game.dto';


describe('GameUpdateComponent', () => {
  let component: GameUpdateComponent;
  let fixture: ComponentFixture<GameUpdateComponent>;
  let dynamicDialogRefMock: jest.Mocked<Partial<DynamicDialogRef>>;
  let gameServiceMock: jest.Mocked<Partial<GameService>>;
  let dialogServiceMock: jest.Mocked<Partial<DialogService>>;
  const gameSubject = new Subject<GameDto>();
  const gameStoreMock = {
    updateGame: jest.fn(),
  }
  const game: GameDto = {
    gameId: 'gameId',
    gameName: 'gameName',
    gameUrl: "gameUrl",
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: new Date(),
    updatedDate: new Date(),
    yearPlayed: new Date(),
    createdBy: 'createdBy',
    updatedBy: 'updatedBy',
  };
  beforeEach(async () => {
    dynamicDialogRefMock = {
      close: jest.fn(),
    };
    gameServiceMock = {
      getGame: jest.fn().mockReturnValue(gameSubject.asObservable()),
    }
    dialogServiceMock = {
      getInstance: jest.fn().mockReturnValue({
        data: '1'
      })
    }
    await TestBed.configureTestingModule({
      imports: [GameUpdateComponent],
      providers: [
        {provide: DynamicDialogRef, useValue: dynamicDialogRefMock},
        {provide: GameStore, useValue: gameStoreMock},
        {provide: GameService, useValue: gameServiceMock},
        {provide: DialogService, useValue: dialogServiceMock},
      ]
    })

    .compileComponents();

    fixture = TestBed.createComponent(GameUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should set value for game signal', () => {
      gameSubject.next(game);
      expect(component.game()?.gameName).toBe(game.gameName);
    });
  })

  describe('submitGame()', () => {
    it('should called updateGame from gameStore when execute submitGame method', () => {
      const updatedGame: GamePutDto = {
        gameName: 'Game',
        categoryId: 'cat-001',
        gameImageUrl: 'gameImageUrl',
        yearPlayed: new Date(),
      }
      component.submitUpdateGame();
      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({gameId: '1',updatedGame, onSuccess: expect.any(Function)});
    });

    it('should called close method', () => {
      gameStoreMock.updateGame.mockImplementation((param) => {
        param.onSuccess();
      })
      component.submitUpdateGame();
      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });
  })
});
