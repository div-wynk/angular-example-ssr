import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { CommonService } from '../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { PersistDataService } from '../../shared/services/persistData.service';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';
import { LoaderService } from '../../shared/services/loader.service';
import { Router } from '@angular/router';
// import { PackageService } from '../../modules/package/service/package.service';
// import { UpdatePlaylist } from '../../models/update-playlist.model';

@Component({
  selector: 'app-add-playlist',
  templateUrl: 'add-playlist.component.html',
  styleUrls: ['add-playlist.component.scss'],
  providers: []
})
export class AddPlaylistComponent implements OnInit {

  @Input() screen_id: any;
  @Input() songInfo: any;
  @ViewChild('playlistName', {static:false}) playlistNameRef: ElementRef;
  public allPlaylists: any;
  public userHasPlaylists: boolean;
  public playlistTitle: string;
  public listFormValid: boolean = false;
  public listFormTouched: boolean = false;
  public songs: any;
  private listFormRegx = /^[a-z\d\-_\s]+$/i;
  public playlistError: string;
  public createNewPlaylist: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private UserService: UserService,
    private commonService: CommonService,
    private toasterService: ToastrService,
    private persistDataService: PersistDataService,
    private analytics: Analytics
  ) {
    this.createNewPlaylist = false;
  }

  ngOnInit() {
    this.loadPlaylist();
    this.loadSongsToBeAdded();
  }

  loadSongsToBeAdded() {
    if (Array.isArray(this.songInfo)) {
      this.songs = this.songInfo.map(song => song.id);
    } else {
      this.songs = [this.songInfo.id];
    }
  }

  loadPlaylist() {
    this.UserService.getPlaylist().subscribe(response => {
      if (response.total > 0) {
        this.allPlaylists = response;
        this.userHasPlaylists = true;
      } else {
        this.allPlaylists = { items: [] };
        this.userHasPlaylists = false;
      }
    });
  }

  showCreatePlaylist() {
    this.createNewPlaylist = true;
  }

  createPlaylist() {
    // this.updatePlaylist('', this.playlistTitle, false, true).subscribe(data => {
    //   this.showToast(this.playlistTitle, true);
    //   this.activeModal.close();
    //   this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, {id: 'Create_New_Playlist'}, Constants.SCREEN_ID.AddToPlaylist);
    //   this.persistDataService.updatePlaylist({});
    // },
    //   err => {
    //     console.log(err);
    //   });
  }

  updatePlaylist(id, title, isPlaylistPublic, isNewPlaylist) {
    // const payload = [{
    //   "songsId": this.songs,
    //   "pid": id == '' ? this.commonService.getCookieForLoggedInUser().uid + '_' + this.commonService.generateRandomId() : id,
    //   "title": title,
    //   "isPublic": isPlaylistPublic,
    // }];
    // return this.packageService.updatePlaylist(payload);
  }

  isFormValid(event) {
    this.playlistTitle = this.playlistNameRef.nativeElement.value.trim();
    this.listFormTouched = this.playlistTitle.length > 0 ? true : false;
    if (this.playlistTitle.length > 60 || this.playlistTitle.length === 0) {
      this.listFormValid = false;
      this.playlistError = Constants.TOAST_MESSAGE.PLAYLIST_CHAR_LIMIT_ERROR;
      this.playlistNameRef.nativeElement.style.borderColor = '#f2a222';
      return;
    }
    let regexTest = this.listFormRegx.test(this.playlistTitle) && this.playlistTitle.length > 0 ? true : false;
    if (!regexTest) {
      this.listFormValid = false;
      this.playlistError = Constants.TOAST_MESSAGE.PLAYLIST_SPECIAL_CHAR_ERROR;
      this.playlistNameRef.nativeElement.style.borderColor = '#f2a222';
      return;
    }
    let playlistExist = this.allPlaylists.items && this.allPlaylists.items.length > 0 ? this.allPlaylists.items.filter((playlist) => playlist.title === this.playlistTitle) : [];
    if (playlistExist.length > 0) {
      this.listFormValid = false;
      this.playlistError = Constants.TOAST_MESSAGE.NAME_EXIST;
      this.playlistNameRef.nativeElement.style.borderColor = '#f2a222';
      return;
    }
    this.playlistNameRef.nativeElement.style.borderColor = '#dee2e6';
    this.listFormValid = true;
  }

  addOrRemoveFromPlaylist(playlist) {

  }
  //   if (playlist.checked) {
  //     //Remove song(s)
  //     let requestPayload = new UpdatePlaylist(playlist.id, false, this.songs, this.screen_id, playlist.title, 0);
  //     this.packageService.deletePlaylist(requestPayload).subscribe(res => {
  //       playlist.checked = false;
  //       playlist.total -= this.songs.length;
  //       this.showToast(playlist.title, false);
  //     },
  //       err => {
  //         console.log(err);
  //       });
  //   } else {
  //     // Add song(s)
  //     this.updatePlaylist(playlist.id, playlist.title, playlist.isPublic, false).subscribe(data => {
  //       playlist.checked = true;
  //       playlist.total += this.songs.length;
  //       this.showToast(playlist.title, true);
  //       this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, {id: 'Playlist_Song_Added'}, Constants.SCREEN_ID.AddToPlaylist);
  //     },
  //       err => {
  //         console.log(err);
  //       });
  //   }
  // }

  showToast(playlistTitle: string, isAdded: boolean) {
    let message = '';
    let title = '';
    let firstSong;
    if (this.songs.length > 1) {
      firstSong = this.songInfo[0];
      message += 'have';
      title = `${firstSong.title.length > 13 ? firstSong.title.substring(0,13)+'...' : firstSong.title } and ${this.songs.length - 1 === 1 ? '1 other' : this.songs.length - 1+' others'}`;
    } else {
      firstSong = Array.isArray(this.songInfo) ? this.songInfo[0] : this.songInfo;
      message += 'has';
      title = firstSong.title;
    }
    if (isAdded)
      message += ` been added to playlist <span>${playlistTitle}</span>`;
    else
      message += ` been removed from playlist <span>${playlistTitle}</span>`;

    let toastInstance = this.toasterService.success(message,  title, { enableHtml: true, closeButton: true, toastClass: 'toast playlist-toast' });
    }


}