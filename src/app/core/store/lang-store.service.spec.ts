import { TestBed } from '@angular/core/testing';

import { LangStoreService } from './lang-store.service';

describe('LangStoreService', () => {
  let service: LangStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
