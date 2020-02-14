import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

import { ApimessageService } from '../message/apimessage/apimessage.service';

export interface RequestCacheEntry {
  url: string;
  response: HttpResponse<any>;
  lastRead: number;
}

export abstract class RequestCache {
  abstract get(req: HttpRequest<any>): HttpResponse<any> | undefined;
  abstract put(req: HttpRequest<any>, response: HttpResponse<any>): void
}

const maxAge = 30000; // maximum cache age (ms)

@Injectable()
export class RequestCacheWithMap implements RequestCache {

  cache = new Map<string, RequestCacheEntry>();

  constructor(private messenger: ApimessageService) { 
    //console.log('request-cache.service RequestCacheWithMap constructor')
  }
  ngOnInit() {
    //console.log('request-cache.service RequestCacheWithMap ngOnInit')
  }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {

    let url = req.urlWithParams;
    const cached = this.cache.get(url);


    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    const expired = isExpired ? 'expired ' : '';
    this.messenger.add(
      `Found ${expired}cached response for "${url}".`);
    return isExpired ? undefined : cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    let url = req.urlWithParams;
    this.messenger.add(`Caching response from "${url}".`);

    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    // remove expired cache entries
    const expired = Date.now() - maxAge;
    this.cache.forEach(entry => {
      if (entry.lastRead < expired) {
        this.cache.delete(entry.url);
      }
    });

    this.messenger.add(`Request cache size: ${this.cache.size}.`);
  }
}


