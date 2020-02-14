import { TestBed } from '@angular/core/testing';

import { ProductInsertService } from './product.insert.service';

describe('ProductInsertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductInsertService = TestBed.get(ProductInsertService);
    expect(service).toBeTruthy();
  });
});
