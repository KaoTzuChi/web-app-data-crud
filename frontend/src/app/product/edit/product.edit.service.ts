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
export class ProductEditService {
  private handleError: HandleError;
  apiUrl = environment.apihost + 'replace_doc_in_mycollection_return_newone/';

  constructor(
    httpErrorHandler: HttpErrorHandler,
    private http: HttpClient,
    private apimessageService : ApimessageService,
    ) {
    this.handleError = httpErrorHandler.createHandleError('ProductEditService');
  }

  ngOnInit() {}

  replaceProduct (product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { headers: new HttpHeaders({'Content-Type':  'application/json'}) })
      .pipe(
        tap(_ => this.log(`updated product id=${product._id}`)),
        catchError(this.handleError('replaceProduct', product))
      );
  }

  private log(message: string) {
    this.apimessageService.add(`ProductEditService: ${message}`);
  }

}
