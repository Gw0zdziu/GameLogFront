import {TestBed} from '@angular/core/testing';

import {LoggedStoreService} from './logged-store.service';

describe('LoggedStoreService', () => {
  let service: LoggedStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
