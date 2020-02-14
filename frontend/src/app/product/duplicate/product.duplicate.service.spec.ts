import { TestBed } from '@angular/core/testing';

import { ProductDuplicateService } from './product.duplicate.service';

describe('ProductDuplicateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductDuplicateService = TestBed.get(ProductDuplicateService);
    expect(service).toBeTruthy();
  });
});
