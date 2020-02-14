import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../product';
import { HttpErrorHandler, HandleError } from '../../api-interactor/http-error-handler.service';
import { environment } from '../../../environments/environment';
import { ApimessageService } from '../../message/apimessage/apimessage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {
  private handleError: HandleError;
  dataUrl = environment.apihost + 'read_mycollection_byid' ;
  apiUrl = environment.apihost + 'delete_doc_in_mycollection_return_count/';
  
  constructor(
    httpErrorHandler: HttpErrorHandler,
    private http: HttpClient,
    private apimessageService : ApimessageService,
    ) {
    this.handleError = httpErrorHandler.createHandleError('ProductDetailService');
  }
  ngOnInit() {}
  
  getProduct(id: string): Observable<Product> {
    let url = `${this.dataUrl}/${id}/`;
    return this.http.get<Product>(url, { headers: new HttpHeaders({'Content-Type':  'application/json'}) })
    .pipe(
      tap(_ => this.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }
  
  deleteProduct (product: Product): Observable<{}> {
    return this.http.post(this.apiUrl, product, { headers: new HttpHeaders({'Content-Type':  'application/json'}) })
      .pipe(
        tap(_ => this.log(`deleted product id=${product._id}`)),
        catchError(this.handleError('deleteProduct'))
      );
  }

  private log(message: string) {
    this.apimessageService.add(`ProductDetailService: ${message}`);
  }
  
}

