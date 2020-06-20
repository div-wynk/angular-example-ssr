import { Component, OnInit, Renderer2, Input } from "@angular/core";
import { Constants } from "../../constant/constants";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageWrapperService } from "../../shared/services/localstorage-wrapper.service";
import { CommonService } from "../../shared/services/common.service";
declare var AFBanner;
@Component({
  selector: "apps-flyer",
  template: ``
})

export class AppsFlyerComponent implements OnInit {

  public urlUtmSource: string;
  @Input() data;
  @Input() type;
  private title : String;

  constructor(
    private renderer: Renderer2,
    private activateRoute: ActivatedRoute,
    private commonService: CommonService, 
    private _localStorageWrapperService: LocalStorageWrapperService,
    ) {
    this.activateRoute.queryParams.subscribe(res => {
      this.urlUtmSource = res['utm_source'];
    })
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this._localStorageWrapperService.isPlatformServer()) {
      this.type === "PACKAGE" ? this.type = "PLAYLIST" : '';
      if(this.data && this.data.isHt){
        this.title = "Set this as your caller tune?";
      }
      else{
        this.title = "Looking for best experience?";
      }

      let settings = {

      // banner settings
      
      title: this.title,
      subtitle: this.getBannerSubtitle(this.type),
      // app_icon: "assets/icons/icon-72x72.png",
      call_to_action: "Install",

        // Note - it is recommended to create and initialize the banner only on mobile devices
        show_only_mobile: true,

        // attribution settings
        media_source: "Website",//=>deeplink
        campaign: this.type.toLowerCase() + '_app_widget',
        sub1: `${this.data ? this.data.title : ''}`,
        af_sub1: this.urlUtmSource,
        utm_source: "wynkWeb",
        utm_campaign: "webtoapptopbanner",

        // routing settings
        onelink_id: Constants.ONELINK_ID,
        subdomain: Constants.SUBDOMAIN,
        mobile_deeplink: this.data ? this.data.shortUrl : ''
      };

      var banner = new AFBanner();
      var ele: HTMLElement = this.renderer.selectRootElement('#my-banner');
      if (ele && ele.children.length > 0) {
        ele.innerHTML = "";
      }
      let isShowBanner = JSON.parse(this._localStorageWrapperService.getItemSessionStorage('isShowBanner'));
      isShowBanner = isShowBanner && !this.commonService.isPwa();
      if (Boolean(isShowBanner)) {
        let mainDiv: HTMLElement = document.getElementById('appflyer-show');
        mainDiv.classList.contains('appflyer-show1') ? '' : mainDiv.classList.add('appflyer-show1');
        banner.init("my-banner", settings);
      }
    }
  }

  getBannerSubtitle(type) {
    let banner_subtitle = '';
    switch (type) {
      case 'PLAYLIST':
      case 'ALBUM':
      case 'ARTIST':
      case 'SONG':
        banner_subtitle = "Listen to this " + this.type.toLowerCase() + " on Wynk App";
        break;
      case 'HOME':
      case 'OTHER':
        banner_subtitle = "Get Wynk app & download songs for free";
        break;
      default: banner_subtitle = "Get Wynk app & download songs for free";
    }
    if(type==='SONG' && this.data.isHt){
      banner_subtitle = "Get Wynk app and set hellotunes for free";      
    }
    return banner_subtitle;
  }

}
