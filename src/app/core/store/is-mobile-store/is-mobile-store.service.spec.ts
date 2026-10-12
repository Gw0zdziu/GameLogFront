import { TestBed } from '@angular/core/testing';

import { IsMobileStoreService } from './is-mobile-store.service';

describe('IsMobileStoreService', () => {
  let service: IsMobileStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsMobileStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
