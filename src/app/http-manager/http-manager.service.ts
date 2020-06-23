import { LocalStorageWrapperService } from './../shared/services/localstorage-wrapper.service';
/**
 * Created by Harish Chandra.
 */
// Imports
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CommonService } from "./../shared/services/common.service";
import { AppUtil } from "../utils/AppUtil";
 import { TfaService } from "../shared/services/tfa.service";

@Injectable({ providedIn: "root" })
export class HttpRequestManager {
  // Resolve HTTP using the constructor
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private appUtil: AppUtil,
    private _localStorageWrapperService: LocalStorageWrapperService,
     private tfaService: TfaService,
  ) {
  }

  getHeaders(token, uri, msisdn, isPlayback=false) {
    const header = {};
        token ? header['x-bsy-utkn'] = token : '';
        this.commonService.getClientSalt(encodeURI(uri)) ? header['x-bsy-cid'] = this.commonService.getClientSalt(encodeURI(uri)) : '';
        header['x-bsy-iswap'] = 'true';
        // this.commonService.getDeviceId() ? header['x-bsy-did'] = this.commonService.getDeviceId() : '';
        if (msisdn) {
            header['x-msisdn'] = msisdn;
        }
        header['Content-Type'] = "application/json";
        if(isPlayback) {
          if(this._localStorageWrapperService.isPlatformServer()){
            return;
          }
          header['x-bsy-t'] = this.tfaService.tek ? this.tfaService.tek : '';
          header['x-bsy-uuid'] = this.tfaService.did ? this.tfaService.did : '' ;
        }
        return header;
  }

  post(
    url: string,
    authorization: string,
    body: Object,
    uri: any,
    deviceId: any,
    userAgent: any,
    isPlayback: boolean = false
  ): Observable<any> {
    let token = this.appUtil.generateToken(url, "POST", body);
    let uri1 = this.appUtil.getUriFromUrl(url);
    let headers = this.getHeaders(token, uri1, "", isPlayback);
    const httOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.post(url, body, httOptions);
  }

  get(
    url: string,
    authorization: any,
    uId: any,
    deviceToken: any
  ): Observable<any> {
    let token = this.appUtil.generateToken(url, "GET", "");
    let uri = this.appUtil.getUriFromUrl(url);
    let headers = this.getHeaders(token, uri, "");
    const httOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.get(url, httOptions);
  }
  
  getConfig(
    url: string,
    authorization: any,
    uId: any,
    deviceToken: any
  ): Observable<any> {
    
    const httOptions = {
      headers: new HttpHeaders(authorization)
    };
    return this.http.get(url, httOptions)
      .pipe(tap(res => ''));
  }

  delete(
    url: string,
    authorization: string,
    uId: any,
    deviceToken: any
  ): Observable<any> {
    let token = this.appUtil.generateToken(url, "DELETE", {});
    let uri = this.appUtil.getUriFromUrl(url);
    let headers = this.getHeaders(token, uri, "");
    const httOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.delete(url, httOptions);
  }

  put(
    url: string,
    authorization: string,
    body: Object,
    uId: any,
    deviceToken: any
  ): Observable<any> {
    let token = this.appUtil.generateToken(url, "PUT", {});
    let uri = this.appUtil.getUriFromUrl(url);
    let headers = this.getHeaders(token, uri, "");
    const httOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.put(url, httOptions);
  }

  patch(
    url: string,
    authorization: string,
    body: Object,
    uId: any,
    deviceToken: any
  ): Observable<any> {
    let token = this.appUtil.generateToken(url, "PATCH", {});
    let uri = this.appUtil.getUriFromUrl(url);
    let headers = this.getHeaders(token, uri, "");
    const httOptions = {
      headers: new HttpHeaders(headers)
    };
    return this.http.patch(url, httOptions);
  }

  getWithoutHeader(url: string): Observable<any> {
    return this.http.get(url);
  }
}
