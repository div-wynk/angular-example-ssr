import { FeaturedModule } from './../featured/featured.module';
import { UserResolver } from './../../shared/services/userResolver';
/**
* Created by Harish Chandra.
*/
import { Component, OnInit } from '@angular/core';
import { HomeService } from './service/home.component.service';
import { HttpRequestManager } from '../../http-manager/http-manager.service';
import { CommonService } from '../../shared/services/common.service';
import { Constants } from '../../constant/constants';
import { Analytics } from '../../analytics/analytics';
import { LoaderService } from '../../shared/services/loader.service';
import { Router, NavigationStart } from '@angular/router';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { LoggerService } from '../../shared/services/logger.service';
import { ErrorConstants } from '../../constant/error_constants';
import { environment } from '../../../environments/environment.prod';
import { PersistDataService } from '../../shared/services/persistData.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  providers: [HomeService, HttpRequestManager, GoogleAnalyticsService]
})
export class HomeComponent implements OnInit {
  public config: any;

  constructor(
    private homeService: HomeService,
    public loaderService: LoaderService,
    private commonService: CommonService,
    private analytics: Analytics,
    public _router: Router,
    private _localStorageWrapperService: LocalStorageWrapperService,
    private loggerService: LoggerService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private persistDataService: PersistDataService,
    private userResolver: UserResolver
  ) {
      this._localStorageWrapperService.setItemSessionStorage('isShowBanner', "true");
      this._router.events.subscribe(evt => { 
        if (evt instanceof NavigationStart) {
            if(this._router.url=="/music"){
                this.commonService.scrollPos = window.scrollY;
            }
            this._localStorageWrapperService.setItemSessionStorage('visited', true);
        }
    });
  }

  ngOnInit() {
    console.log("home comp");
    this.getFeaturedContentDataOnFingerPrintGenerated();
    this.commonService.removeShimmeringElement();
    this.getpageOpenEvent()
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    this.googleAnalyticsService.sendEvents(environment.APP_VERSION,"VirtualPageView","HomeComponent");
    this.persistDataService.isFreshUser$.subscribe(res => {
      if (res) {
        this.getFeaturedContentDataOnFingerPrintGenerated();
        this.getpageOpenEvent();
      }
    });
  }

  getFeaturedContentDataOnFingerPrintGenerated() {
    if (this.commonService.checkedForNonLoginUser()){
      if (this._localStorageWrapperService.getItem('config')) {
        this.config = JSON.parse(this._localStorageWrapperService.getItem('config'));
        this.commonService.setUserDetailsObj(this.config);
      } else {
        this.getConfigData();
      }
    }
  }

  languageChanged(value) {    
    if(value.value)
      this.homeService.userProfile(value.value);
    try {
      value.ref.close();
    }
    catch (ex) {
      console.log(ex);
    }
  }

  getConfigData() {
    this.homeService.getConfig().subscribe(
      response => {
        this.config = response;
        this.commonService.setUserDetailsObj(response);
        this._localStorageWrapperService.setItem(
          "config",
          JSON.stringify(response)
        );
      },
      err => {
        //console.log(err);
        this.loggerService.errorLog(ErrorConstants.errors.ERRO1.code, ErrorConstants.errors.ERRO1.title, err.message);
      }
    );
  }

  getpageOpenEvent() {
    let meta: Object = {};
    meta['id'] = "APP_OPEN_ID";
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.APP_STARTED, meta, Constants.SCREEN_ID.homescreen);
  }
}
