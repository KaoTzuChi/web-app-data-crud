import { TestBed } from '@angular/core/testing';

import { Error404Service } from './error404.service';

describe('Error404Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Error404Service = TestBed.get(Error404Service);
    expect(service).toBeTruthy();
  });
});
