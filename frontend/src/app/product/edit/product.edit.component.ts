import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { ProductDetailService } from '../detail/product.detail.service';
import { Product } from '../product';
import { ProductEditService } from './product.edit.service';

@Component({
  selector: 'app-supervisor-product-edit',
  templateUrl: './product.edit.component.html',
  providers: [ProductEditService, ProductDetailService],
  styleUrls: ['./product.edit.component.css']
})

export class ProductEditComponent implements OnInit {
  @Input() product: Product;
  currentid: string = '';
  jstoday : string = '';
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private productDetailService: ProductDetailService,
    private productEditService: ProductEditService,
    private location: Location,
    private router: Router,
  ) {
    this.jstoday = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZ', 'en-us', '+0800');
    this.product = new Product();
    this.product.field1 = '';
    this.product.field2 = {'item1':'', 'item2':''};
    this.product.field3 = this.jstoday.toString();
  }

  ngOnInit() {
    this.currentid = this.activatedRoute.snapshot.paramMap.get('id');
    this.getProduct(this.currentid);
  }

  goBack(): void {
    this.router.navigate(["/product/query"]);
  }

  getProduct(id:string): void {
    this.productDetailService.getProduct(id)
      .subscribe(product => this.product = product);
  }

  replaceProduct(){
    this.productEditService.replaceProduct(this.product)
      .subscribe(() => {
      this.router.navigate(["/product/query"]);
    });
  }

}
