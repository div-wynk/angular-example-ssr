import { Injectable } from "@angular/core";
import { LocalStorageWrapperService } from "./localstorage-wrapper.service";
import { UserService } from "./user.service";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Constants } from "../../constant/constants";
import { ModalPopupService } from "./modal-popup.service";
import { PersistDataService } from "./persistData.service";

@Injectable({
  providedIn: "root"
})
export class FollowedDataService {
  public followedArtists: any = [];
  public followedPlaylists: any = []
  public artistMap: any = {};
  public playlistMap: any = {};
  public followedResponseAvailable: boolean = false;

  private _followedArtists = new Subject<any>();
  public followedArtists$ = this._followedArtists.asObservable();

  private _followedResponseAvailable = new Subject<any>();
  public followedResponseAvailable$ = this._followedResponseAvailable.asObservable();

  private _followedPlaylists = new Subject<any>();
  public followedPlaylists$ = this._followedPlaylists.asObservable();

  private _artistMap = new Subject<any>();
  public artistMap$ = this._artistMap.asObservable();

  private _playlistMap = new Subject<any>();
  public playlistMap$ = this._playlistMap.asObservable();

  constructor(
    private _localStorageWrapperService: LocalStorageWrapperService,
    private userService: UserService,
    private toasterService: ToastrService,
    private popUpService: ModalPopupService,
    private persistDataService: PersistDataService
  ) {
    this.getUserFollowedData();

    this.persistDataService.isUserLogin$.subscribe(isLoggedIn => {
      if(!isLoggedIn){                
        this.clearData();     
      } else {
        this.getUserFollowedData();
      }
    });
  }

  isUserLoggedIn() {
    return this._localStorageWrapperService.getCookies("loggedInUser")
      ? JSON.parse(this._localStorageWrapperService.getCookies("loggedInUser"))
      : null;
  }

  getUserFollowedData() {
    let userData = this.isUserLoggedIn();
    if (userData && userData.uid) {
      this.userService.getFollowedData().subscribe(res => {
        if (res && res.artist && res.playlist) {
          this.artistMap = {};
          this.playlistMap = {};
          this.followedArtists = res.artist.map(artistItem => {
            
            this.artistMap[artistItem.id] = true;
            return { ...artistItem, type: "artist" };
          });
          this._artistMap.next(this.artistMap);
          this._followedArtists.next(this.followedArtists);
          this.followedPlaylists = res.playlist.map(playlistItem => {
            this.playlistMap[playlistItem.id] = true;
            return { ...playlistItem };
          });
          this._followedPlaylists.next(this.followedPlaylists);
          this._playlistMap.next(this.playlistMap);
        }
        this.followedResponseAvailable = true;
        this._followedResponseAvailable.next(this.followedResponseAvailable);
      }, err =>{
        this.followedResponseAvailable = true;
        this._followedResponseAvailable.next(this.followedResponseAvailable);
      });
    }
  }

  // getFollowedArtists() {
  //   let userData = this.isUserLoggedIn();
  //   if (userData && userData.uid) {
  //     this.userService.getFollowedArtists().subscribe(res => {
  //       if (res && res.artist) {
  //         this.artistMap = {};
  //         this.followedArtists = res.artist.map(artistItem => {
  //           this.artistMap[artistItem.id] = true
  //           return { ...artistItem, type: "artist" };
  //         });
  //         this._followedArtists.next(this.followedArtists);
  //       }
  //     });
  //   }
  // }

  // getFollowedPlaylists() {
  //   let userData = this.isUserLoggedIn();
  //   if (userData && userData.uid) {
  //     this.userService.getFollowedPlaylists().subscribe(res => {
  //       if (res && res.playlist) {
  //         this.playlistMap = {};
  //         this.followedPlaylists = res.playlist.map(playlistItem => {
  //           this.playlistMap[playlistItem.id] = true;
  //           return { ...playlistItem };
  //         });
  //         this._followedPlaylists.next(this.followedPlaylists);
  //       }
  //     });
  //   }
  // }

  follow(id: any, type, title,followObject) {    
    let userData = this.isUserLoggedIn();
    if (userData && userData.uid) {
      this.userService.follow(id, type).subscribe(res => {        
        if (res && res.success) {

          if (type.toLowerCase() === "artist") {

            this.toasterService.success(Constants.TOAST_MESSAGE.FOLLOW_ARTIST.replace('<artist>',title));
            if(!this.artistMap[id]){
              this.artistMap[id] = true;
              this.followedArtists.push(followObject);
              this._artistMap.next(this.artistMap);
              this._followedArtists.next(this.followedArtists);
            }

          } else {
            this.toasterService.success(Constants.TOAST_MESSAGE.FOLLOW_PLAYLIST);
            if(!this.playlistMap[id]){
              this.playlistMap[id] = true;
              this.followedPlaylists.push(followObject);
              this._playlistMap.next(this.playlistMap);
              this._followedPlaylists.next(this.followedPlaylists);
            }
          }
        }
      });
    } else {
      this.popUpService.openLoginModal('Follow');
    }
  }

  clearData() {
    this.followedArtists = [];
    this.followedPlaylists = [];
    this.artistMap = {};
    this.playlistMap = {};
  }

  unfollow(id: any, type, title) {
    let userData = this.isUserLoggedIn();
    if (userData && userData.uid) {
      this.userService.unFollow(id, type).subscribe(res => {
        if (res && res.success) {
          if (type.toLowerCase() === "artist") {
            this.toasterService.success(Constants.TOAST_MESSAGE.UNFOLLOW_ARTIST.replace('<artist>',title))
            if(this.artistMap[id]){
              this.followedArtists = this.followedArtists.filter((artist)=>{
                return artist.id !== id
              })
              delete this.artistMap[id];
              this._artistMap.next(this.artistMap);
              this._followedArtists.next(this.followedArtists);
            }
          } else {
            this.toasterService.success(Constants.TOAST_MESSAGE.UNFOLLOW_PLAYLIST)
                        
            if(this.playlistMap[id]){
              delete this.playlistMap[id];
              this.followedPlaylists = this.followedPlaylists.filter((playlist)=>{
                return playlist.id !== id
              })
              this._playlistMap.next(this.playlistMap);
              this._followedPlaylists.next(this.followedPlaylists);
            }
          }
        }
      });
    } else {
      this.popUpService.openLoginModal('Follow');
    }
  }
}
