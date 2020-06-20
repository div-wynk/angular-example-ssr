import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { LocalStorageWrapperService } from './localstorage-wrapper.service';

@Injectable({
  providedIn: 'root'
})

export class LoaderService {

  public showLoader: boolean = false;
  private loaderStatus: boolean = false;

  constructor(private _localStorageWrapperService: LocalStorageWrapperService) { }

  public loaderState(status) {
    // if (status && !this._localStorageWrapperService.isPlatformServer()) {
    //   this.loaderStatus = status;
    //   setTimeout(() => {
    //     if (this.loaderStatus) {
    //       this.showLoader = true;
    //     }
    //   }, 500);
    // } else {
    //   this.showLoader = false;
    //   this.loaderStatus = false;
    // }
  }
}