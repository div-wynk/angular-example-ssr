/**
* Created by Harish Chandra.
*/
import { Injectable } from '@angular/core';
import { HttpRequestManager } from '../../../http-manager/http-manager.service';
import { Constants } from '../../../constant/constants';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../shared/services/common.service';
import { LocalStorageWrapperService } from '../../../shared/services/localstorage-wrapper.service';
import { ErrorConstants } from '../../../constant/error_constants';
import { LoggerService } from '../../../shared/services/logger.service';
import { UserService } from '../../../shared/services/user.service';
import { PersistDataService } from '../../../shared/services/persistData.service';

@Injectable()
export class HomeService {
    CONTENT_URL = environment.CONTENT_URL;
    SAPI_URL = environment.SAPI_URL;
    // CORE_BASE_URL = 'https://content.wynk.in/music/';
    // Resolve HTTP using the constructor
    private token: any;
    private deviceToken: any;
    private uId: any;

    private feturedDataValidity: any;
    private additionTime = (2 * 60 * 60) * 1000;;
    private feturedData: any;
    private config:any;

    constructor(
        private httpRequestManager: HttpRequestManager,
        private commonService: CommonService, 
        private _localStorageWrapperService: LocalStorageWrapperService,
        private loggerService: LoggerService,
        private userService: UserService,
        private persistDataService:PersistDataService
    ) {
        this.token = this._localStorageWrapperService.getItem('token');
        this.deviceToken = this._localStorageWrapperService.getItem('device-token');
        this.uId = this._localStorageWrapperService.getItem('uId');
    }
    getConfig() {
        // // if(!this._localStorageWrapperService.isPlatformServer()){
        //     return this.httpRequestManager.get(environment.SAPI_URL + Constants.GET_CONFIG,
        //         this.token, this.uId, this.deviceToken);
        // // }
        return this.httpRequestManager.get(this.SAPI_URL + Constants.GET_CONFIG,
            '', '', '');

    }
    getFeturedData(langs): any {
        return this.httpRequestManager.getWithoutHeader(this.CONTENT_URL + Constants.GET_HOME_FEATURED_CONTENT+langs);
    }

    // postAccountCall() {
    //         const deviceId = this.commonService.getDeviceId();
    //         const uri = Constants.POST_LOGIN;
    //         const data = { deviceId: deviceId, userAgent: deviceId };
    //         return this.httpRequestManager.post(this.SAPI_URL + uri, '', data, '', deviceId, deviceId);
        
    // }
    getProfile(lansArray){
        return this.httpRequestManager.post(this.SAPI_URL+Constants.PROFILE,'',lansArray,'','','');
    }

    getUserDetails(callback) {      
        let token;
        const userObj = this.commonService.getCookieForLoggedInUser() || this.commonService.getCookieForNonLoggedInUser();
        if ( userObj && userObj.token && userObj.uid) {
             token = this.commonService.signHeader(Constants.GET_CONFIG, 'GET', userObj.token, userObj.uid, undefined);
        } 
        this.httpRequestManager.getConfig(this.SAPI_URL + Constants.GET_CONFIG, this.httpRequestManager.getHeaders(token, "/music" + Constants.GET_CONFIG, ''), '', '').subscribe(res => {
            callback && callback();
        }, err => {
            //console.log(err);
            this.loggerService.errorLog(ErrorConstants.errors.ERRO1.code, ErrorConstants.errors.ERRO1.title, err.message);
        });
    }
    getFooterContent(){
       return this.httpRequestManager.getWithoutHeader("https://assets.wynk.in/wap/content/footer.json");
    }

    userProfile(value) {
        let data = value.map(ele => ele.id);
        let payload = { contentLang: data };
        this.getProfile(payload).subscribe(res => {      
            let config = this.commonService.getUserDetailsObj();
            if (config) {
                config.profile = res;
                this.config = config;
                this._localStorageWrapperService.setItem('config', JSON.stringify(this.config));
                this.commonService.setUserDetailsObj(config);
                this.getDefaultFeaturedData();
            }
        })
    }

    addRecoRailForLoginUser(data){
        this._localStorageWrapperService.setItem('featuredTime', new Date().getTime().toString());
    
        if(this.commonService.checkedForLoginUser()){
            this.userService.getRecommendedContents().subscribe(res=>{
                let recommendedSongIndex = data.items.findIndex(el=> el.parentPackageType === 'FEATURED');
                data.items.splice(recommendedSongIndex + 1,0,this.filterRecommendedContent(res,'recommended_songs'));
    
                let recommendedArtistIndex = data.items.findIndex(el=> el.parentPackageType === 'TRENDING_ARTISTS');
                data.items.splice(recommendedArtistIndex,0,this.filterRecommendedContent(res,'recommended_artists'));
    
                let recoPlaylistPos = data.items.filter(el=>{
                return (el.parentPackageType === 'TOP_CHARTS' || el.parentPackageType === 'REDESIGN_MOODS' || el.parentPackageType === 'MOODS' || el.parentPackageType === 'CAMPAIGN_MODULE_13')
                });
    
                if (recoPlaylistPos.length > 0) {
                let recoPlaylistPosType = recoPlaylistPos[recoPlaylistPos.length - 1].parentPackageType;
                let recommendedPlaylistIndex = data.items.findIndex(el=> (el.parentPackageType === recoPlaylistPosType));
                    data.items.splice(recommendedPlaylistIndex + 1,0,this.filterRecommendedContent(res,'recommended_playlists'));
                } else {
                    data.items.splice(recommendedArtistIndex + 2,0,this.filterRecommendedContent(res,'recommended_playlists'));
                }
    
                this.feturedData = data;
                this._localStorageWrapperService.setItem('featuredData', JSON.stringify(this.feturedData));
                this.persistDataService.setFeaturedData(this.feturedData);            
            });
        } else {
            this.feturedData = data;
            this._localStorageWrapperService.setItem('featuredData', JSON.stringify(this.feturedData));
            this.persistDataService.setFeaturedData(this.feturedData);
        }
    }
    


    filterRecommendedContent(recoData, type){
      return recoData.items.filter(el=>el.id === type)[0];
    }


    getDefaultFeaturedData() {
      const userObj = this.commonService.getUserDetailsObj();
      let langs: any;
      if (userObj && userObj.profile) {
        langs = userObj.profile.selectedContentLangs;
      } else {
        langs = Constants.DEFAULT_LANGUAGES;
      }
  
      this.getFeturedData(langs).subscribe(response => {
        this.addRecoRailForLoginUser(response)
      }, err => {
        console.log(err);
      });
    }


    checkAndUpdateFeatureData() {
        let currenttime = JSON.parse(new Date().getTime().toString());
        this.feturedDataValidity = JSON.parse(this._localStorageWrapperService.getItem('featuredTime')) + this.additionTime;
        if (this._localStorageWrapperService.getItem('featuredData') == null || currenttime > this.feturedDataValidity) {
          this.getDefaultFeaturedData();
        }
        else {
          this.feturedData = JSON.parse(this._localStorageWrapperService.getItem('featuredData'));      
          this.persistDataService.setFeaturedData(this.feturedData);
        }
    }
}
