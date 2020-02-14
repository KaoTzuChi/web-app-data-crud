import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProductModule } from './product/product.module';
import { Error404Component } from './message/error404/error404.component';
import { HomeComponent } from './home/home.component';

const app_routes: Routes =  [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(app_routes, {
      scrollPositionRestoration: 'top'
   }),
    ProductModule,
    CommonModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    Error404Component,
    HomeComponent,
  ]
})

export class AppRoutingModule { }
