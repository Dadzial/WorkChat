import { TestBed } from '@angular/core/testing';

import { GetAllService } from './get-all.service';

describe('GetAllService', () => {
  let service: GetAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
