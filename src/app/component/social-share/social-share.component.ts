import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';
import { CommonService } from '../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-social-share',
  templateUrl: 'social-share.component.html',
  styleUrls: ['./social-share.component.scss']
})
export class SocialShareComponent implements OnInit {

  @Input() shareSongInfo;
  @Input() screenID;
  text: string;
  popup_w = 550;
  popup_h = 300;
  popup_l = (window.screen.width / 2) - (this.popup_w / 2);
  popup_t = (window.screen.height / 2) - (this.popup_h / 2);

  constructor(
    public activeModal: NgbActiveModal,
    private analytics: Analytics,
    private commonService: CommonService,
    private toasterService: ToastrService,
  ) { }

  ngOnInit() {
    this.message(this.shareSongInfo.type)
  }


  facebook() {
    let key = this.findModuleType();
    let meta = this.generateEventsForShare("Share_Facebook", key);
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, this.screenID);
    window.open('https://www.facebook.com/dialog/share?app_id=200963466775165&display=popup&caption=' + this.text + ' on Wynk Music' + '&href=' + this.shareSongInfo.shortUrl + '&show_error=true',
      'Facebook', 'height=' + this.popup_h + ',width=' + this.popup_w + ',top=' + this.popup_t + ',left=' + this.popup_l);
  }

  twitter() {
    let key = this.findModuleType();
    let meta = this.generateEventsForShare("Share_Twitter", key);
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, this.screenID);
    window.open('http://twitter.com/share?text=' + this.text + ' on Wynk Music' + '&url=none',
      'Twitter', 'height=' + this.popup_h + ',width=' + this.popup_w + ',top=' + this.popup_t + ',left=' + this.popup_l);
  }

  whatapp() {
    let key = this.findModuleType();
    let meta = this.generateEventsForShare("Share_WhatsApp", key);
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, this.screenID);
    window.open('https://api.whatsapp.com/send?text=' + this.text + ' on Wynk Music');
  }

  copyShareUrl() {
    let copysharedUrl: any = document.createElement('textArea');
    copysharedUrl.setAttribute('readonly', true);
    copysharedUrl.value = this.shareSongInfo.shortUrl;
    document.body.appendChild(copysharedUrl);

    if (this.commonService.isAndroid() || this.commonService.isDesktop()) {
      copysharedUrl.select();
    } else {
      let range = document.createRange();
      range.selectNodeContents(copysharedUrl);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copysharedUrl.setSelectionRange(0, 999999);
    }

    document.execCommand('copy');
    this.toasterService.show(Constants.TOAST_MESSAGE.URL_COPIED);
    document.body.removeChild(copysharedUrl);
  }

  message(contentType) {
    switch (contentType) {
      case 'SONG':
        this.text = "Listen to " + this.shareSongInfo.title + " at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'ALBUM':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'MOOD':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " mood at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'GENRE':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " genre at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'ARTIST':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " artist at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'PLAYLIST':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " playlist at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'PACKAGE':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      case 'USERPLAYLIST':
        this.text = "Listen to songs of " + this.shareSongInfo.title + " at " + encodeURI(this.shareSongInfo.shortUrl);
        break;
      default:
        this.text = "Groove with WynkMusic - the largest Indian & International music destination. Download unlimited music and listen to it offline!"
    }
  }

  generateEventsForShare(id, key) {
    let meta: any = {};
    meta.id = id;
    meta.type = this.shareSongInfo.type;
    key ? meta[key] = this.shareSongInfo.id : '';
    return meta;
  }

  findModuleType() {
    let key: any;
    switch (this.shareSongInfo.type) {
      case "PACKAGE":
        key = "Package_Id";
        break;
      case "PLAYLIST":
        key = "Playlist_Id";
        break;
      case "ARTIST":
        key = "Artist_Id";
        break;
      case "ALBUM":
        key = "Album_Id";
        break;
      case "SONG":
        key = "Song_Id";
        break;
      default:
        key = null;
        break;
    }
    return key;
  }

}
