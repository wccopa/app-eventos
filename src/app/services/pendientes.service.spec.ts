import { TestBed } from '@angular/core/testing';

import { PendientesService } from './pendientes.service';

describe('PendientesService', () => {
  let service: PendientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
