import { PersistDataService } from './../../shared/services/persistData.service';
import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/services/common.service";
import { AppUtil } from "../../utils/AppUtil";
import { Analytics } from "../../analytics/analytics";
import { Constants } from "../../constant/constants";
@Component({
  selector: "app-download-popup",
  templateUrl: "download-popup.component.html",
  styleUrls: ["download-popup.component.scss"]
})
export class DownloadPopupComponent implements OnInit {

  public isMobileView;
  public popupHeading: any;
  public headingobject: object;
  @Input() url;
  @Input() type;
  @Input() viewType: string;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private commonService: CommonService,
    private appUtil: AppUtil,
    private analytics: Analytics,
    private persistDataService: PersistDataService
  ) { 
    this.headingobject = {
      'package': 'playlist',
      'playlist': 'playlist',
      'userplaylist': 'playlist',
      'album': 'album',
      'artist': 'artist’s top songs',
      'song': 'song',
      'hellotunes': 'hellotunes'
    }
  }

  ngOnInit() {
    this.isMobileView = !this.commonService.modifyMobileView();
    if(this.type)
      this.popupHeading = this.setPopupHeading(this.type.toLowerCase());
  }

  setPopupHeading(type) {
    return this.headingobject[type];
  }

  openStoreUsingAppsflyer() {
    let meta = this.generateEventsForDownloadPopUp("Install");
    this.analytics.createAnalyticsEvent(
      Constants.EVENT_NAME.CLICK,
      meta,
      Constants.SCREEN_ID.DOWNLOAD_POPUP
    );
    this.redirectToUrl(this.url);
  }

  redirectToUrl(url){
    location.href = url;
  }

  navigateToApp(isAndroid) {
    let meta;
    if (!isAndroid) {
      meta = this.generateEventsForDownloadPopUp("iOS_Install");
    } else {
      meta = this.generateEventsForDownloadPopUp("Android_Install");
    }
    this.analytics.createAnalyticsEvent(
      Constants.EVENT_NAME.CLICK,
      meta,
      Constants.SCREEN_ID.DOWNLOAD_POPUP
    );
    let url = this.appUtil.getAppUrl(isAndroid);
    //window.location.href = url;
    window.open(url, "_blank");
  }
  generateEventsForDownloadPopUp(id) {
    let meta: any = {};
    meta.id = id;
    return meta;
  }
}
