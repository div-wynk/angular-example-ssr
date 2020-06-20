/**
* Created by Harish Chandra.
*/
// Imports
//import Fingerprint2 from 'fingerprintjs2';
import { CommonService } from '../shared/services/common.service';
import { Injectable } from '@angular/core';
import { PersistDataService } from '../shared/services/persistData.service';
import { LocalStorageWrapperService } from '../shared/services/localstorage-wrapper.service';

@Injectable({ providedIn: 'root' })
export class AppUtil {
    // Resolve HTTP using the constructor
    public key: any;
    constructor(private commonService: CommonService, private persistDataService: PersistDataService, private _localStorageWrapperService: LocalStorageWrapperService) {
    }
generateFingerprint() { 
        if(!this._localStorageWrapperService.getItem('fingerprint_v2')){
            let result=this.commonService.generateRandomId();
            this._localStorageWrapperService.setItem("fingerprint_v2",result);
            this.commonService.setDeviceId(result);
        }
        else{
            this.commonService.setDeviceId(this._localStorageWrapperService.getItem('fingerprint_v2'));
        }
    }

    getSelectedLangsForApi(profile) {
        const commonValues = profile.selectedContentLangs &&
            profile.selectedContentLangs.filter(function (value) { return profile.fullyCuratedLanguages.indexOf(value) > -1; });
        if (!(commonValues && commonValues.length)) {
            return profile.selectedContentLangs && profile.selectedContentLangs.concat(profile.backUpLanguage);
        } else {
            return profile.selectedContentLangs;
        }
    }
    generateToken(url, requestType, payload) {
        const userObj = this.commonService.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser() ||
            this.commonService.getCookieForNonLoggedInUser() || this.persistDataService.getCookiesForNonLoggedInUser();
        if (userObj) {            
            return this.commonService.signHeader(url, requestType, userObj.token, userObj.uid, payload);
        }
        // console.log('need to handle token Generation');
        return null;
    }
    getUriFromUrl(value: any) {
        let url;
        try {
            url = new URL(value);
            return url.pathname + url.search;
        }
        catch (ex) {

        }
    }
    getAppUrl(isAndroid) {
        let redirectUrl = "";
        if (isAndroid) {
            redirectUrl = 'https://play.google.com/store/apps/details?id=com.bsbportal.music&hl=en&isExternal=true';
        } else {
            redirectUrl = 'https://itunes.apple.com/in/app/wynk-music-hindi-english-songs/id845083955?mt=8';
        }

        return redirectUrl;
    };
}
