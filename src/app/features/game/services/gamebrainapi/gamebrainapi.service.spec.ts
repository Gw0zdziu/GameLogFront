import { TestBed } from '@angular/core/testing';

import { GamebrainapiService } from './gamebrainapi.service';

describe('GamebrainapiService', () => {
  let service: GamebrainapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamebrainapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
