import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import {
  isPlatformServer, isPlatformBrowser
} from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { ErrorConstants } from "../../constant/error_constants";


@Injectable({ providedIn: "root" })
export class LocalStorageWrapperService {
  public localStorageData: any = {};
  public cookieStorageData: any = {};
  public sessionStorageData: any = {};
  public isCookieEnabled: boolean =  true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService,
  ) {
    this.isCookieEnabled =  navigator && navigator.cookieEnabled ? navigator.cookieEnabled : false;
  }

  getItem(key) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled)
      return localStorage.getItem(key);
    
    return this.localStorageData && this.localStorageData[key]
      ? this.localStorageData[key]
      : null;
  }

  setItem(key, value) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled )
      localStorage.setItem(key, value);
    else
      this.localStorageData[key] = value;
  }

  removeItem(key) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled)
      localStorage.removeItem(key);
    else 
      delete this.localStorageData[key];

  }

  clearStorage() {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled)
      localStorage.clear();
    else 
      this.localStorageData = {};
  }

  //Cookies Service
  getCookies(name: string) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled )
      return this.cookieService.get(name);
    
    return this.getLocalCookie(name);    
  }

  checkcookies(name: string) {
    if(isPlatformBrowser(this.platformId)){
      return this.cookieService.check(name);
    }
  }

  setCookie(
    name: string,
    value: string,
    expires?: number | Date,
    path?: string,
    domain?: string,
    secure?: boolean
  ) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled)
      this.cookieService.set(name, value, expires, path, undefined, undefined, "Strict");
    else 
      this.setLocalCookie(name,value,expires,path);
  }

  deleteAllCookie(path?: string, domain?: string) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled) 
      this.cookieService.deleteAll();
    else 
      this.cookieStorageData = {};

  }

  deleteCookie(name: string, path?: string, domain?: string) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled)
      this.cookieService.delete(name, path, domain);
    else 
      this.deleteLocalCookie(name)
  }

  getUrlPathName(value) {
    if (isPlatformBrowser(this.platformId)) {
      let url;
      try {
        url = new URL(value);
        return url.pathname + url.search;
      } catch (ex) {
      }
    }
    return "";
  }

  setLocalCookie(name, value, expiry, path = '/') {
    this.cookieStorageData[name] = { value, expiry, path }
  }
  
  getLocalCookie(name){
    return this.cookieStorageData[name] ? this.cookieStorageData[name].value : null;
  }
  
  deleteLocalCookie(name) {
    this.cookieStorageData[name] ? delete this.cookieStorageData[name] : null;
  }

  getItemSessionStorage(key) {
    if (isPlatformBrowser(this.platformId)  && this.isCookieEnabled )
      return sessionStorage.getItem(key);

    return this.sessionStorageData[key];
  }

  setItemSessionStorage(key, value) {
    if (isPlatformBrowser(this.platformId)  && this.isCookieEnabled )
      sessionStorage.setItem(key, value);
    else 
      this.sessionStorageData[key] = value;
  }

  removeItemSessionStorage(key) {
    if (isPlatformBrowser(this.platformId) && this.isCookieEnabled) 
      sessionStorage.removeItem(key);
    else 
      delete this.sessionStorageData[key];    
  }

  isPlatformServer() {
    if (isPlatformServer(this.platformId))
      return true;    
    return false;
  }
}
