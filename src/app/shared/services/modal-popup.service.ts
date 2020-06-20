import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialShareComponent } from '../../component/social-share/social-share.component';
import { AddPlaylistComponent } from '../../component/add-playlist/add-playlist.component';
import { LoginComponent } from '../../component/login/login.component';
import { CommonService } from './common.service';
import { PersistDataService } from './persistData.service';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';
import { DownloadPopupComponent } from '../../component/download-popup/download-popup.component';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { WarningPopupComponent } from '../../component/warning-popup/warning-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ModalPopupService {
  public urlUtmSource: any;

  constructor(private modalService: NgbModal,
    private commonService: CommonService,
    private persistDataService: PersistDataService,
    private analytics: Analytics,
    private activateRoute: ActivatedRoute,
    private titlecasePipe: TitleCasePipe
  ) {
    this.activateRoute.queryParams.subscribe(res => {
      this.urlUtmSource = res['utm_source'];
    })
  }

  shareTo(songinfo, screenID) {
    const modalRef = this.modalService.open(SocialShareComponent, { centered: true, windowClass: 'shareModal' });
    modalRef.componentInstance.shareSongInfo = songinfo;
    modalRef.componentInstance.screenID = screenID;
  }

  newPlaylist(songinfo, screen_id) {
    let userObject = this.commonService.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser();
    if (userObject) {
      const modalRef = this.modalService.open(AddPlaylistComponent,{centered: true});
      modalRef.componentInstance.songInfo = songinfo;
      modalRef.componentInstance.screen_id = screen_id;
    }
    else {
      this.openLoginModal("Add_To_Playlist");
    }
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, {id: 'Add_To_Playlist'}, screen_id);
  }
  downloadSong(song, origin, viewType, screenID) {
    let url = this.commonService.generateAppsFlyerUrl(song, origin, this.urlUtmSource, viewType, screenID);
    const modalRef = this.modalService.open(DownloadPopupComponent, { centered: true });
    modalRef.componentInstance.url = url;
    modalRef.componentInstance.type = song.type;
    modalRef.componentInstance.viewType = viewType.toLowerCase();


    if (origin === 'header') {
      let meta = this.generateEventsForLogIn("Downloads");
      meta['Campaign'] = `Top_Section_${this.titlecasePipe.transform(song.type)}`;
      this.analytics.createAnalyticsEvent(
        Constants.EVENT_NAME.CLICK,
        meta,
        Constants.SCREEN_ID.DOWNLOAD_POPUP
      );
    }
  }

  openLoginModal(reason, languageConstants ?: Object) {
    const modalRef = this.modalService.open(LoginComponent, { centered: true, size: 'lg', windowClass:'login-modal-dialog'});
    modalRef.componentInstance.reasonToOpen = reason;
    modalRef.componentInstance.languageConstants = languageConstants;
  }

  openWarningModal(heading: string, message: string, leftBtn?: string, rightBtn?: string, styles ?: Object){
    const modalRef = this.modalService.open(WarningPopupComponent, { centered: true });
    modalRef.componentInstance.heading = heading;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.leftBtn = leftBtn;
    modalRef.componentInstance.rightBtn = rightBtn;
    modalRef.componentInstance.styles = styles;
    return modalRef;
  }

  generateEventsForLogIn(id) {
    let meta: any = {};
    meta.id = id;
    return meta;
  }
}
