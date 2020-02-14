import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../product';
import { HttpErrorHandler, HandleError } from '../../api-interactor/http-error-handler.service';
import { environment } from '../../../environments/environment';
import { ApimessageService } from '../../message/apimessage/apimessage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductQueryService {
  private apiUrl = environment.apihost + 'read_mycollection_all/' ;
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private apimessageService : ApimessageService,
    ) {
    this.handleError = httpErrorHandler.createHandleError('ProductQueryService');
  }
  ngOnInit() {}

  getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>( this.apiUrl, { headers: new HttpHeaders({'Content-Type':  'application/json'}) } )
      .pipe(
        tap(_ => this.log('fetched products')),
        catchError(this.handleError('getProducts', []))
      );
  }

  private log(message: string) {
    this.apimessageService.add(`ProductQueryService: ${message}`);
  }

}

