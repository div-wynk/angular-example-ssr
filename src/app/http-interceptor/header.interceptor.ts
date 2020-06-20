import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpEventType,HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { CommonService } from '../shared/services/common.service';
import { LoggerService } from '../shared/services/logger.service';
import { Constants } from '../constant/constants';
import { environment } from '../../environments/environment';
import { PersistDataService } from '../shared/services/persistData.service';
import { CustomErrorHandler } from '../shared/services/errorHandler.service';


@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(
    private commonService:CommonService, 
    private loggerService:LoggerService,
    private errorHandler: CustomErrorHandler,
    private persistDataService:PersistDataService  
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>  {
    var started = Date.now();
    if(req.headers){
      if(req.url === environment.SSR_URL + Constants.LOGGER_URL){
        return next.handle(req);
      } else if (req.url === environment.PING + Constants.GET_BS) {
        return next.handle(req).pipe( 
          map(event => {
            if (event instanceof HttpResponse) {
              let head = [];
              head[0] = event.headers.get(this.commonService.k);
              head[1] = event.headers.get(this.commonService.n);
              head[2] = event.headers.get(this.commonService.y);
              head[3] = event.headers.get(this.commonService.w);
              head[4] = event.headers.get(this.commonService.m);
              head[5] = event.headers.get(this.commonService.z);
              head[6] = event.headers.get(this.commonService.a);
              head[7] = event.headers.get(this.commonService.p);
              this.commonService.setSecHeaders(head);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.status === 403){
              this.commonService.removeCookieForLoggedInUser("");
              this.persistDataService.setUserLoggedIn(false);
            }
            this.errorHandler.handleApiError(error, req);
            return throwError(error);
          })
        );
      } else{
        return next.handle(req).pipe(
          map(event => {
            if (event.type == HttpEventType.Response) {
              const elapsed = Date.now() - started;
              // this.loggerService.requestLog(req.url, elapsed);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.status === 403){
              this.commonService.removeCookieForLoggedInUser("");
              this.persistDataService.setUserLoggedIn(false);
            }
            this.errorHandler.handleApiError(error, req);
            return throwError(error); 
        }));
      }
    }    
  }
}
