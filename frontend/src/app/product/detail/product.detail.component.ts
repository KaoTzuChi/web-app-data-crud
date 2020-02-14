import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../product';
import { ProductDetailService } from './product.detail.service';

@Component({
  selector: 'app-supervisor-product-detail',
  templateUrl: './product.detail.component.html',
  providers: [ProductDetailService],
  styleUrls: ['./product.detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  currentid: string = '';
  product: Product;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productDetailService: ProductDetailService,
    private location: Location,
    private router: Router,
  ) {
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

  deleteProduct(): void{
    this.productDetailService.deleteProduct(this.product)
      .subscribe(() => {
      this.router.navigate(["/product/query"]);
    });
  }
  

}
