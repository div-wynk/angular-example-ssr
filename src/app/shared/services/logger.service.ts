import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../constant/constants';
import { environment } from '../../../environments/environment.prod';
import { LocalStorageWrapperService } from './localstorage-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private http: HttpClient, private _localStorageWrapperService: LocalStorageWrapperService ) { }

  requestLog(url: string, tat: number) {
    const payload = {
        'type':'request',
        'tat': tat,
        'url': url
    }
    this._localStorageWrapperService.isPlatformServer() ? this.http.post(environment.SSR_URL+Constants.LOGGER_URL, payload)
    .subscribe(res => {}, error => {
      console.log(JSON.stringify(error), "Error is");
    }):'';
  }

  errorLog(code: string, title: string, description: string){
    const payload = {
      'type':'error',
      'code': code,
      'title': title,
      'desc': description
    }
    this._localStorageWrapperService.isPlatformServer() ?  this.http.post(environment.SSR_URL+Constants.LOGGER_URL, payload).subscribe(res => {},
      error => {
          console.log(error, "Error is");
    }): '';
  }
}
