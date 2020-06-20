import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';
import { ModalPopupService } from '../../shared/services/modal-popup.service';
import { PersistDataService } from '../../shared/services/persistData.service';
import { FollowedDataService } from '../../shared/services/followed-data.service';

@Component({
  selector: 'app-popover',
  templateUrl: 'popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  @Input('song') songInfo: any;
  @Input() hasEditPermission: boolean;
  @Input() moduleId: any;
  @Input() popoverOrigin: string;
  @Input() screenId: any
  @Input() showShare: boolean;
  @Input() showFollow: boolean;
  @Input() hideDownload: boolean;
  @Input() showRemove: boolean;
  @Input() dropZone: string;
  @Output() deletePlaylistEvent = new EventEmitter();
  @Output() playlistVisibilityStatusEvent = new EventEmitter();
  @Output() socialEvent = new EventEmitter();
  @Output() addPlaylistEvent = new EventEmitter();
  @Output() clearQueueEvent = new EventEmitter();
  
  public typeMap: any = {}
  public itemType: any = '';
  public isFollowed: boolean = false;
  public isFollowable: boolean = false;


  constructor(
    private analytics: Analytics,
    private modalService: ModalPopupService,
    private persistDataService: PersistDataService,
    private followedDataService: FollowedDataService
  ) { }

  ngOnInit() {    
    this.itemType = this.songInfo.type;
    this.isFollowable = !!this.songInfo.isFollowable;
    
    if(this.songInfo && this.songInfo.type === 'ARTIST') {

      this.typeMap = this.followedDataService.artistMap;      
      this.isFollowed = this.typeMap[this.songInfo.id]? true :false

    } else if(this.songInfo && (this.songInfo.type === "PLAYLIST" || this.songInfo.type === "USERPLAYLIST" || this.songInfo.type === "SHAREDPLAYLIST" || this.songInfo.type === "PACKAGE")) {
      
      this.typeMap = this.followedDataService.playlistMap;
      this.isFollowed = this.typeMap[this.songInfo.id]? true :false
    }    
  }

  socialShare(ev) {
    this.socialEvent.emit(ev);
  }

  addPlaylist(ev) {
    this.addPlaylistEvent.emit(ev);
  }

  generateEventsForPopUp(id, key) {
    let meta: any = {};
    meta.id = 'Overflow_' + id;
    meta.ContentType = key;
    meta.contentId = this.songInfo.id;
    return meta;
  }

  getPopOverEvents(id) {
    let meta = this.generateEventsForPopUp(id, this.screenId);
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, this.screenId);
  }

  appsFlyerInstallEvents(viewType) {
    //this.getPopOverEvents(viewType);
    this.modalService.downloadSong(this.songInfo, 'list_popover', viewType, this.screenId);
  }

  removeSong(songDetails) {
    const data = { 'song': songDetails, type: this.screenId.toLowerCase() };
    this.persistDataService.removeSong(data);
  }

  checkAndClosePlayer() {
    if (this.screenId === 'Queue') this.persistDataService.queuePopupDisplay(false);
  }

  generateEventsForPlaylistInfo(id) {
    let meta: any = {};
    meta.id = id;
    return meta;
  }

  playlistVisibilityStatus(status) {
    this.playlistVisibilityStatusEvent.emit(status)
  }

  deletePlaylist() {
    this.deletePlaylistEvent.emit();
    let meta = this.generateEventsForPlaylistInfo("Delete_Playlist");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.PLAYLIST_INFO_PAGE);
  }

  followUnfollowClick() {       
    const { id, title, type, smallImage, profileImage } = this.songInfo;
    let followObject = {
      id, 
      smallImage:profileImage || smallImage ,
      title,
      type
    }       
    if(!this.typeMap[id]){
        this.followedDataService.follow(id,type,title,followObject);
    } else {
        this.followedDataService.unfollow(id,type,title);
    }
  }
}