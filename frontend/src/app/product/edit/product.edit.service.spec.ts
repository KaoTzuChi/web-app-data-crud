import { TestBed } from '@angular/core/testing';

import { ProductEditService } from './product.edit.service';

describe('ProductEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductEditService = TestBed.get(ProductEditService);
    expect(service).toBeTruthy();
  });
});
