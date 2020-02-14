import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDuplicateComponent } from './product.duplicate.component';

describe('ProductDuplicateComponent', () => {
  let component: ProductDuplicateComponent;
  let fixture: ComponentFixture<ProductDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
