import { Component, OnInit } from '@angular/core';
import { CommonService } from './shared/services/common.service';
import { environment } from '../environments/environment';
import { LocalStorageWrapperService } from './shared/services/localstorage-wrapper.service';
@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit{
  registrationForm: any;
  constructor(private commonService: CommonService, private _localStorageWrapperService: LocalStorageWrapperService) {
    this.commonService.imgEvent$.subscribe(res => {
      if (res && res.M) {
        const img1 = document.createElement('img');
        img1.src = environment.IMG_URI + res.M + '.jpg';
        img1.style.display = 'none';
        document.body.appendChild(img1);
        img1.onerror = (e: Event) => {
          this.commonService.goOnBuddy.next(1);
        };
        img1.onload = (e: Event) => {
          this.commonService.goOnBuddy.next(1);
        };
      }
      if (res && res.F) {
        const img2 = document.createElement('img');
        img2.src = environment.IMG_URI + res.F + '.jpg';
        img2.style.display = 'none';
        document.body.appendChild(img2);
        img2.onerror = (e: Event) => {
          this.commonService.goOnBuddy.next(2);
        };
        img2.onload = (e: Event) => {
          this.commonService.goOnBuddy.next(2);
        };
      }
    });
  }

  ngOnInit() {
    // let checkStatus;
    // const element = new Image();
    // Object.defineProperty(element, 'id', {
    //   get: function() {
    //     checkStatus = 'on';
    //     setTimeout(function() {while (true) {eval("debugger");}},1800000);
    //   }
    // });

    // requestAnimationFrame(function check() {
    //   checkStatus = 'off';
    //   console.dir(element);
    //   requestAnimationFrame(check);
    // });
  }

}
