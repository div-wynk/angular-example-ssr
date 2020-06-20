import { environment } from './../../../environments/environment';
import { LocalStorageWrapperService } from './localstorage-wrapper.service';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { CommonService } from './common.service';
import { PersistDataService } from './persistData.service';
declare var Hls: any

@Injectable({
    providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {
  private url_features: {
    url: string,
    pagepath: string,
    domain: string,
    query: string
  };
  private commonError: {
    browser: string,
    os: string,
    is_serviceWorker: boolean,
    HLS_supported: boolean,
    app_version: string,
    screen_x: number,
    screen_y: number,
    is_mobile: boolean,
    did: string
  };
  private isOnline: boolean;
  private commonService: any;
  private currentSong;
  private isQueueOpen: boolean;
  private referrer: String;
    
  constructor( 
    private injector: Injector,
    private _localStorageWrapperService: LocalStorageWrapperService,
    private persistDataService: PersistDataService,
    private http: HttpClient
    ) {
      setTimeout(() => {
        this.commonService = this.injector.get(CommonService);
      }, 0);
    }

  updateDeviceData(){
    this.commonError = {
      browser: this.commonService.browserType,
      os: this.commonService.getOperatingSystem(),
      is_serviceWorker: this.commonService.serviceWorker(),
      HLS_supported: Hls.isSupported(),
      app_version: this.commonService.appVersion(),
      screen_x: this.commonService.getScreenWidth(),
      screen_y: this.commonService.getScreenHeight(),
      is_mobile: this.commonService.modifyMobileView() ? true : false,
      did: this.commonService.getDeviceId() || null
    };
  }

  handleError(error) {
    if(!environment.enableErrorHandler || !error.stack || this._localStorageWrapperService.isPlatformServer()){
      if(!environment.production) console.error(error);
      return;
    }
    console.error(error);
    if(!(this.commonError && this.commonError.browser)) this.updateDeviceData();

    this.url_features = this.commonService.getUrlFeatures();
    this.isOnline = this.commonService.isOnline();
    let subscription = this.persistDataService.currentPlayingSong$.subscribe((res)=>{
      this.currentSong = res;
      this.isQueueOpen = this.persistDataService.isShowQueue;
      this.referrer = document.referrer;
      let body = {
        stack: error.stack,
        isOnline: this.isOnline,
        isQueueOpen: this.isQueueOpen,
        referrer: this.referrer,
        currentSong: this.currentSong,
        ...this.commonError,
        ...this.url_features
      };
      this.pushEventToQueue(body, true);
    })
    subscription.unsubscribe();
  }

  handleApiError(api_error, req){
    if(!environment.enableErrorHandler || this._localStorageWrapperService.isPlatformServer())
      return;
    
    if(!(this.commonError && this.commonError.browser)) this.updateDeviceData();

    this.url_features = this.commonService.getUrlFeatures();
    this.isOnline = this.commonService.isOnline();
    let body = {
      api_error: {
        response: api_error.error,
        message: api_error.message,
        name: api_error.name,
        status: api_error.status,
        statusText: api_error.statusText,
        url: api_error.url,
        request_body: JSON.stringify(req.body),
        request_method: req.method,
        request_headers: JSON.stringify(req.headers.get('headers'))
      },
      requestTime: (new Date()).getTime(),
      isOnline: this.isOnline,
      ...this.commonError,
      ...this.url_features
    };
    this.pushEventToQueue(body, false);
  }
  
  pushEventToQueue(error, forceFlush = false) {
    if(this._localStorageWrapperService.isPlatformServer()) {
        return true;
    } 

    let errorQueue = this.commonService.getEventList("errorEvents") || [];
    errorQueue.push(error);

    if (errorQueue.length >= 5 || forceFlush) {
      this.http.post(environment.ERROR_TRACE_URL, errorQueue).subscribe( res => {
          console.log(res);
      });
      this.commonService.removeEventsFromCache("errorEvents");
    } else  
      this.commonService.setEventList("errorEvents", errorQueue);  
  }
}
