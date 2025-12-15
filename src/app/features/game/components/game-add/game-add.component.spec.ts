import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameAddComponent} from './game-add.component';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {GameStore} from '../../store/game-store';
import {ChangeDetectionStrategy, Component, output, signal} from '@angular/core';
import {GamePostDto} from '../../models/game-post.dto';
import {GameFormComponent} from '../game-form/game-form.component';

@Component({
  selector: 'app-game-form',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class MockGameFormComponent {
  readonly submitEmitter = output<GamePostDto>();
}

describe('GameAddComponent', () => {
  let component: GameAddComponent;
  let fixture: ComponentFixture<GameAddComponent>;
  let dynamicDialogRefMock: jest.Mocked<Partial<DynamicDialogRef>>;
  const gameStoreMock = {
    postGame: jest.fn(),
    isLoading: signal(false),
  }
  beforeEach(async () => {
    dynamicDialogRefMock = {
      close: jest.fn(),
    }
    await TestBed.configureTestingModule({
      imports: [GameAddComponent],
      providers: [
        {provide: DynamicDialogRef, useValue: dynamicDialogRefMock},
        {provide: GameStore, useValue: gameStoreMock},
      ]
    }).overrideComponent(GameAddComponent, {
      remove: {
        imports: [GameFormComponent]
      },
      add: {
        imports: [MockGameFormComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('submitNewGame()', () =>{
    it('should called postGame from gameStore when execute submitNewGame method', () => {
      const newGame: GamePostDto = {
        gameName: 'RPG',
        categoryId: 'cat-001',
      }
      component.submitNewGame(newGame);
      expect(gameStoreMock.postGame).toHaveBeenCalledWith({newGame, onSuccess: expect.any(Function)});
    });

    it('should called close method', () => {
      const newGame: GamePostDto = {
        gameName: 'RPG',
        categoryId: 'cat-001',
      }
      gameStoreMock.postGame.mockImplementation((param) => {
        param.onSuccess();
      })
      component.submitNewGame(newGame);
      expect(dynamicDialogRefMock.close).toHaveBeenCalledWith(true);
    });
  })
});
