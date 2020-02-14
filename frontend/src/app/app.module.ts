import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatSidenavModule, 
  MatSelectModule, MatIconModule, MatFormFieldModule, MatListModule,
  MatDialogModule, MatRadioModule } from '@angular/material';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApimessageService } from './message/apimessage/apimessage.service';
import { ApimessageComponent } from './message/apimessage/apimessage.component';
import { RequestCache, RequestCacheWithMap } from './api-interactor/request-cache.service';
import { HttpErrorHandler } from './api-interactor/http-error-handler.service';



@NgModule({
  declarations: [
    AppComponent,
    ApimessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule
  ],
  providers: [
    HttpErrorHandler,
    ApimessageService,
    { provide: RequestCache, useClass: RequestCacheWithMap },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
