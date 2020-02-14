import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { Product } from '../product';
import { ProductQueryService } from './product.query.service';

@Component({
  selector: 'app-supervisor-product-query',
  templateUrl: './product.query.component.html',
  providers: [ProductQueryService],
  styleUrls: ['./product.query.component.css']
})

export class ProductQueryComponent implements OnInit {
  products: Product[];
  selectedItem: Product;
  displayColumn = ['radio', 'serialno', '_id', 'field1', 'field2', 'field3', 'field4'];

  constructor(
    private productQueryService: ProductQueryService,
    private location: Location,
    private router: Router,
    ) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts(): void {
    this.productQueryService.getProducts()
      .subscribe(products => {
        this.products = products;
        if((this.products!=null)&&(this.products.length>0)){
          this.selectedItem = this.products[0];
        }
      });
  } 
  goBack(): void {
    this.router.navigate(["/product/query"]);
  }
  goInsert(path1:string) {
    this.router.navigate(["/product/insert"]);
  }
  goMaintain(path1:string, path2:string) {
    this.router.navigate(["/product/"+path2+"/"+this.selectedItem._id]);
  }
  onSelect(item: Product): void {
    this.selectedItem = item;
  }
}
