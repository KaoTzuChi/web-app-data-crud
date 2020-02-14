import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ApimessageService } from '../message/apimessage/apimessage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  
})
export class ProductComponent implements OnInit {

  constructor(
    private apimessageService : ApimessageService,
    private location: Location,
    private router: Router,
  ) {  

  }

  ngOnInit() {
    //this.apimessageService.clear();
  }

  goHome(): void {
    this.apimessageService.clear();
    this.router.navigate(["../home"]);
  }

}


