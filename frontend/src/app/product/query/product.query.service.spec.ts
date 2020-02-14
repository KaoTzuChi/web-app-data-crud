import { TestBed } from '@angular/core/testing';

import { ProductQueryService } from './product.query.service';

describe('ProductQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductQueryService = TestBed.get(ProductQueryService);
    expect(service).toBeTruthy();
  });
});
