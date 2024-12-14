import { TestBed } from '@angular/core/testing';

import { AdelantoService } from './adelanto.service';

describe('AdelantoService', () => {
  let service: AdelantoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdelantoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
