import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatListModule, MatRadioModule,
MatTableModule, MatFormFieldModule, MatInputModule,
MatCheckboxModule } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { ProductComponent } from './product.component';

import { ProductQueryComponent } from './query/product.query.component';
import { ProductDetailComponent } from './detail/product.detail.component';
import { ProductEditComponent } from './edit/product.edit.component';
import { ProductInsertComponent } from './insert/product.insert.component';
import { ProductDuplicateComponent } from './duplicate/product.duplicate.component';

const product_routes = [
  { path: 'product', component: ProductComponent, children: [
    { path: 'query', component: ProductQueryComponent },
    { path: 'insert', component: ProductInsertComponent },
    { path: 'detail/:id', component: ProductDetailComponent },
    { path: 'edit/:id', component: ProductEditComponent },
    { path: 'duplicate/:id', component: ProductDuplicateComponent },
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(product_routes),
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  entryComponents: [
  ],
  declarations: [
    ProductComponent,
    ProductQueryComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductInsertComponent,
    ProductDuplicateComponent,
  ]
})
export class ProductModule { 
  constructor() {  }
  ngOnInit() { }
}

