import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameUpdateComponent} from './game-update.component';
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {GamePostDto} from '../../models/game-post.dto';
import {GameFormComponent} from '../game-form/game-form.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameStore} from '../../store/game-store';
import {GameService} from '../../services/game.service';
import {Subject} from 'rxjs';
import {GamePutDto} from '../../models/game-put.dto';
import {GameDto} from '../../models/game.dto';

@Component({
  selector: 'app-game-form',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class MockGameFormComponent {
  readonly submitEmitter = output<GamePostDto>();
  readonly updatedGame = input<GamePutDto | null>();
}

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
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    createdDate: '2023-08-15T10:30:00.000Z',
    updatedDate: '2024-11-28T14:45:22.000Z',
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
      .overrideComponent(GameUpdateComponent, {
        remove: {imports: [GameFormComponent]},
        add: {imports: [MockGameFormComponent]}
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
      }
      component.submitUpdateGame(updatedGame);
      expect(gameStoreMock.updateGame).toHaveBeenCalledWith({gameId: '1',updatedGame, onSuccess: expect.any(Function)});
    });

    it('should called close method', () => {
      const newGame: GamePostDto = {
        gameName: 'RPG',
        categoryId: 'cat-001',
      }
      gameStoreMock.updateGame.mockImplementation((param) => {
        param.onSuccess();
      })
      component.submitUpdateGame(newGame);
      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });
  })
});
