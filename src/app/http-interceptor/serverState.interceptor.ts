import {makeStateKey, TransferState} from '@angular/platform-browser';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as memoryCache from 'memory-cache';
import { of } from 'rxjs';
import { LoggerService } from '../shared/services/logger.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {
    toBeCached: Object = {};

    constructor(private transferState: TransferState, private loggerService: LoggerService) {
        this.toBeCached[`${environment.SAPI_URL}/v3/account/login`] = 1;
        this.toBeCached[`${environment.SAPI_URL}/v2/config`] = 1;
        this.toBeCached[`${environment.SSR_URL}/assets/json/tv-map.json`] = 1;
        this.toBeCached[`${environment.SSR_URL}/assets/json/footerData.json`] = 1;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const cachedData = memoryCache.get(req.url);
        if (cachedData) {
        this.transferState.set(makeStateKey(req.url), cachedData);
            return of(new HttpResponse({ body: cachedData, status: 200 }));
        }
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.transferState.set(makeStateKey(req.url), event.body);
                    if(this.toBeCached[req.url])
                        memoryCache.put(req.url, event.body);
                }
            })
        );
    }
}