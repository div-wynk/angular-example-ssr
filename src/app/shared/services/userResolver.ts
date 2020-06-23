import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { CommonService } from "./common.service";
import { PersistDataService } from "./persistData.service";
import { Constants } from "../../constant/constants";
import { environment } from "../../../environments/environment";
import { AppUtil } from "../../utils/AppUtil";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageWrapperService } from "./localstorage-wrapper.service";
 import { TfaService } from "./tfa.service";

@Injectable({
  providedIn:"root"
})
export class UserResolver implements Resolve<any>{
  SAPI_URL = environment.SAPI_URL;
  constructor(
    private appUtil:AppUtil,
    private commonService: CommonService,
    private http: HttpClient,
    private persistDataService: PersistDataService,
     private tfaService: TfaService,
  ) {
    let imgNo = 0;
    this.commonService.goOnBuddy$.subscribe((res) => {
      if (typeof res === 'number') {
        imgNo++;
        imgNo === 2 && this.resolve();
      }
    });
    this.appUtil.generateFingerprint();
  }

  resolve() {
    const userCookie = this.commonService.getCookieForNonLoggedInUser();
    if (!userCookie || !userCookie.dt || !userCookie.kt) {
      // Fresh User
      this.askForBS().toPromise().then(() => {
        this.postAccountCall().toPromise().then((res: any)=>{
          const user = { uid: res.uid, token: res.token, dt: res.dt, kt: res.kt, server_timestamp: res.server_timestamp };
          this.persistDataService.setCookieForNonLoggedInUser(user);
          this.commonService.setCookieForNonLoggedInUser(user);
          this.commonService.saveRequiredParams(res.dt, res.kt, res.server_timestamp);
          this.persistDataService.setFreshUser();
           this.tfaService.nextTek();
          return false;
        }).catch(err => {
          return false;
        });
      }).catch(err => {
        console.log(err);
      });
    } else {
      // Returning user
      // tslint:disable-next-line: no-shadowed-variable
      const loggedInUserCookie = this.commonService.getCookieForLoggedInUser();
      if (loggedInUserCookie) {
        this.persistDataService.setUserLoggedIn(true);
         this.tfaService.nextTek();
        return true;
      } else {
        this.commonService.saveRequiredParams(userCookie.dt, userCookie.kt, Date.now());
        this.persistDataService.setCookieForNonLoggedInUser(userCookie);
         this.tfaService.nextTek();
        return false;
      }
    }
  }

  askForBS() {
    return this.http.post(environment.PING + Constants.GET_BS, {
      'pid': this.commonService.bk_2()
    }, {headers: new HttpHeaders({
      'sk': '507f1f77bcf86cd799439011',
      'tk': new Date().getTime().toString(),
      'bk': this.commonService.bk_1(),
      'pk': btoa(this.SAPI_URL)
    })});
  }

  postAccountCall() {
    return this.http.post(environment.LOGIN_URL + Constants.POST_LOGIN, {}, {headers: new HttpHeaders({
      'x-bsy-wynk' : 'wynk-web',
      'x-bsy-cip' : this.commonService.cip,
      'x-bsy-das': 'asdas',
      'x-bsy-ptot': new Date().getTime().toString(),
    })});
  }
}