import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { Product } from '../product';
import { ProductDetailService } from '../detail/product.detail.service';
import { ProductDuplicateService } from './product.duplicate.service';

@Component({
  selector: 'app-supervisor-product-duplicate',
  templateUrl: './product.duplicate.component.html',
  providers: [ProductDuplicateService, ProductDetailService],
  styleUrls: ['./product.duplicate.component.css']
})

export class ProductDuplicateComponent implements OnInit {
  @Input() product: Product;
  currentid: string = '';
  jstoday : string = '';
    
  constructor(
    private activatedRoute: ActivatedRoute,
    private productDetailService: ProductDetailService,
    private productDuplicateService: ProductDuplicateService,
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

  duplicateProduct(){
    this.productDuplicateService.duplicateProduct(this.product)
      .subscribe(() => {
      this.router.navigate(["/product/query"]);
    });
  }

}
