import { Injectable } from '@angular/core';
import { LocalStorageWrapperService } from "./localstorage-wrapper.service";
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: "root" })
export class TfaService {

  public did : string;
  private ltd : number;
  private tpk : string;
  public tek: string;
  private otpTimeOut;
  private sk = '51ymYn1MS';

  constructor(
    private _localStorageWrapperService: LocalStorageWrapperService
  ) {
    this.did = this._localStorageWrapperService.getItem('uuid');
    this.ltd = this._localStorageWrapperService.getItem('ltd');
    this.tpk = this._localStorageWrapperService.getItem('tpk');
    this.tek = this._localStorageWrapperService.getItem('tek');
  }

  setRequiredParams(did, tkey, st) {
    return
    // this.did = did;
    // this.tpk = tkey;
    // this.ltd = Number(st) - new Date().getTime();
    // this._localStorageWrapperService.setItem('uuid', this.did);
    // this._localStorageWrapperService.setItem('tpk', this.tpk);
    // this._localStorageWrapperService.setItem('ltd', this.ltd);
  }

  setltd(st){
    return;
    // this.ltd = Number(st) - new Date().getTime();
    // this._localStorageWrapperService.setItem('ltd', this.ltd);
  }

  gettotp() {
    return;
    // const counter = Math.floor((Date.now() + this.ltd) / 600000);
    // const otp = hotp.generate(this.did + this.sk, counter);
    // return otp;
  }

  nextTek = () => {
    return;
    // if(this._localStorageWrapperService.isPlatformServer()){
    //   return;
    // }
    // const otp = this.gettotp();
    // const fk = CryptoJS.AES.encrypt(this.tpk, otp);
    // this.tek = fk.toString();
    // this._localStorageWrapperService.setItem('tek', fk);
    // this.otpTimeOut = setTimeout(this.nextTek, 600000);
  }

  updateTek(){
    return;
    // if(this._localStorageWrapperService.isPlatformServer()){
    //   return;
    // }
    // clearTimeout(this.otpTimeOut);
    // this.nextTek();
  }
 
}
