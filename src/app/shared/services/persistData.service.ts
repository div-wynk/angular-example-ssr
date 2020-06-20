import { PlatformLocation } from '@angular/common';
import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { LocalStorageWrapperService } from "./localstorage-wrapper.service";
@Injectable({ providedIn: "root" })
export class PersistDataService {

  constructor(private _localStorageWrapperService : LocalStorageWrapperService, private platformNavigation: PlatformLocation) {
    if (this._localStorageWrapperService.getItem("queueData") != null) {
      this.setQueues(JSON.parse(this._localStorageWrapperService.getItem("queueData")));
    }
    this.setSoundQuality( this._localStorageWrapperService.getItem("quality") || "Auto" );
    try{
      let rplList = JSON.parse(this._localStorageWrapperService.getItemSessionStorage("rpl"));
      if(rplList != null){
        this.setRplList(rplList);
        this.rplSongList = rplList;
      } else {
        this.setRplList(this.rplSongList);
      }
    }catch(e){
      this._localStorageWrapperService.setItemSessionStorage("rpl", JSON.stringify([]));
      this.setRplList(this.rplSongList);
    }
  }
 
  public isPwaPushShow = new BehaviorSubject<any>(false);
  public isPwaPushShow$ = this.isPwaPushShow.asObservable();

  // Recently Played List
  private rplList = new BehaviorSubject<any>([]);
  public rplList$ = this.rplList.asObservable();

  // Queued Data Observables.
  private _totalQueuedSongs = new BehaviorSubject<any>([]);
  public totalQueuedSongs$ = this._totalQueuedSongs.asObservable();

  // Current Songs Observables.
  private _currentAddedSong = new Subject<any>();
  public currentAddedSong$ = this._currentAddedSong.asObservable();

  // add Item Observables.
  private _newAddedItem = new Subject<any>();
  public newAddedItem$ = this._newAddedItem.asObservable();

  // Featured Data Observables
  private _featuredData = new BehaviorSubject<any>({});
  public featuredData$ = this._featuredData.asObservable();

  // Next Previous Observables
  private _playerControlsTrigger = new BehaviorSubject<any>({});
  public playerControlsTrigger$ = this._playerControlsTrigger.asObservable();

  //pause Player Observable
  private _isPlaySong = new BehaviorSubject<any>(true);
  public isPlaySong$ = this._isPlaySong.asObservable();

  //remove song from queue Observable
  private _removeSong = new BehaviorSubject<any>(true);
  public removeSong$ = this._removeSong.asObservable();

  //current playing Observable
  public _currentPlayingSong = new BehaviorSubject<any>({song: {title: '', smallImage: ''}, isPlaying: 'false'});
  public currentPlayingSong$ = this._currentPlayingSong.asObservable();

  //clear queue Observable
  private _clearQueue = new BehaviorSubject<any>(true);
  public clearQueue$ = this._clearQueue.asObservable();

  // Clear Queue Observable for Player
  private _clearQueueForPlayer = new Subject<any>();
  public clearQueueForPlayer$ = this._clearQueueForPlayer.asObservable();

  // LHS playlist update
  private _PlaylistUpdate = new Subject<any>();
  public PlaylistUpdate$ = this._PlaylistUpdate.asObservable();

  //update user playlist
  private _updateUserPlaylist = new Subject<any>();
  public updateUserPlaylist$ = this._updateUserPlaylist.asObservable();

  //Login Observer
  private _isUserLogin = new BehaviorSubject<any>(false);
  public isUserLogin$ = this._isUserLogin.asObservable();

  //Language Observer
  private _contentLang = new Subject<any>();
  public contentLang$ = this._contentLang.asObservable();

  //update featureData after login and Signout
  private _isFeatureDataUpdate = new Subject<any>();
  public isFeatureDataUpdate$ = this._isFeatureDataUpdate.asObservable();

  //Show queue popup
  private _queuePopup = new Subject<any>();
  public queuePopup$ = this._queuePopup.asObservable();

  //Play Playlist Song on hover play icon  click
  private _autoPlayPlaylistSong = new BehaviorSubject<any>(null);
  public autoPlayPlaylistSong$ = this._autoPlayPlaylistSong.asObservable();

  //Repeat Player Control
  private _playerRepeat = new BehaviorSubject<string>('Off');
  public playerRepeat$ = this._playerRepeat.asObservable();

  //Sound Quality Control
  private _soundQuality = new BehaviorSubject<string>('Auto');
  public soundQuality$ = this._soundQuality.asObservable();

  //Queue Autoplay Songs
  private _queueAutoplaySwitch = new BehaviorSubject<boolean>(true);
  public queueAutoplaySwitch$ = this._queueAutoplaySwitch.asObservable();
  private _lastSongIdInQueue = new BehaviorSubject<{}>(null);
  public autoplayQueueUpdate$ = this._lastSongIdInQueue.asObservable();
  private _songsToRemoveFromAutoplayQueue = new BehaviorSubject<{}>(null);
  public songsToRemoveFromAutoplayQueue$ = this._songsToRemoveFromAutoplayQueue.asObservable();
  // Fresh user who doesn't have non-logged-in cookie
  private _isFreshUser = new BehaviorSubject<{}>(null);
  public isFreshUser$ = this._isFreshUser.asObservable();
  public queuedSongList = [];
  public rplSongList: Array<{}> = [];
  public nonLoggedInUserData: any;
  public loggedInUserData: any;
  public isShowQueue: boolean = false;
  public songIconClickedAt = 0;
  public queueWasEmpty: boolean = true;
  
  setQueues(data: Array<any>, noRecoUpdate: boolean = false) {
    this._totalQueuedSongs.next(data);
    this.queuedSongList = data;
    if(this.queuedSongList.length > 0){
      let lastSongID = this.queuedSongList[this.queuedSongList.length - 1].id;
      let artistID = undefined;
      if(this.queuedSongList[this.queuedSongList.length - 1].subtitleType === 'ARTIST'){
        artistID = this.queuedSongList[this.queuedSongList.length - 1].subtitleId;
      }else if(this.queuedSongList[this.queuedSongList.length - 1].singers && this.queuedSongList[this.queuedSongList.length - 1].singers[0]){
        artistID = this.queuedSongList[this.queuedSongList.length - 1].singers[0].id;
      }
      let langID = this.queuedSongList[this.queuedSongList.length - 1].contentLang;
      if(!noRecoUpdate){ 
        let obj: any = this._lastSongIdInQueue.getValue();
        obj == null || lastSongID !== obj.id ? this._lastSongIdInQueue.next({id: lastSongID, artistID, langID}) : null;
      } 
    }
    this._localStorageWrapperService.setItem("queueData", JSON.stringify(this.queuedSongList));
  }

  autoPlayPlaylistSong(data){
    this._autoPlayPlaylistSong.next(data);
  }

  // addSong(song: CurrentSong, clearQueue: boolean, noRecoUpdate: boolean = false) {
  //   if (!song.isQueue) {      
  //   if(this.queuedSongList.length === 0){
  //       this.queueWasEmpty = true;
  //       this.addSpaceForPlayer();
  //     }
  //     else this.queueWasEmpty = false;
  //     if (song.currentSong && (song.currentSong.type == 'PLAYLIST' || song.currentSong.type == 'PACKAGE' || song.currentSong.type == 'ARTIST' || song.currentSong.type == 'ALBUM' || song.currentSong.type == 'USERPLAYLIST' || song.currentSong.type == 'RECO')) {
  //       if(clearQueue)
  //         this.queuedSongList = song.currentSong.items;
  //       else{
  //         let songsToAdd = song.currentSong.items.filter(element => {
  //           return this.queuedSongList.findIndex(e => e.id === element.id) === -1;
  //         });
  //         this.queuedSongList = this.queuedSongList.concat(songsToAdd);
  //       }
  //     } else {
  //       const index = this.queuedSongList.findIndex(
  //         e => e.id === song.currentSong.id
  //       );
  //       if (index == -1) {
  //         this.queuedSongList.push(song.currentSong);
  //       }else if(index!=-1){
  //         this.queuedSongList.splice(index, 1);
  //         this.queuedSongList.push(song.currentSong);
  //       }
  //     }
  //     this.setQueues(this.queuedSongList,noRecoUpdate);
  //   }
  //   this.setNewItem(song);
  // }

  addSpaceForPlayer() {
    let footerEl = document.getElementById('footer');
    footerEl && !footerEl.classList.contains('footer-mb') ? footerEl.classList.add('footer-mb') : '';
    document.body.classList.add('showPlayeratBottom');
  }

  newSongAdded(song: any) {
    // only change the song loaded on player when network is present
    if(window.navigator.onLine)
      this._currentAddedSong.next(song);
  }

  setFeaturedData(data) {
    this._featuredData.next(data);
  }

  setNewItem(data) {
    this._newAddedItem.next(data);
  }

  setControlsTrigger(control: any) {
    this._playerControlsTrigger.next(control);
  }

  setPlayerRepeat(value:string){
    this._playerRepeat.next(value);
    this._playerControlsTrigger.next({repeat: value});
    if(value === '1' || value === 'All') this._queueAutoplaySwitch.next(false);
    if(value === 'Off') this._queueAutoplaySwitch.next(true);
  }

  isPlaySong(isPause) {
    this._isPlaySong.next(isPause);
  }

  removeSong(details) {
    this._removeSong.next(details);
  }

  setCurrentPlayingSong(song, isPlaying) {
    const data = { song: song, isPlaying: isPlaying };
    this._currentPlayingSong.next(data);
  }

  clearRecoQueue() {
    this._lastSongIdInQueue.next(null)
  }
  
  clearQueue(value) {
    this.clearRecoQueue();
    this._clearQueue.next(value);
  }

  clearQueueForPlayer(value) {
    this.clearRecoQueue();
    this._clearQueueForPlayer.next(value);
  }

  setCookieForNonLoggedInUser(cookies) {
    this.nonLoggedInUserData = cookies;
  }

  getCookiesForNonLoggedInUser() {
    return this.nonLoggedInUserData;
  }

  setCookieForLoggedInUser(cookies) {
    this.loggedInUserData = cookies;
  }

  deleteCookieForLoggedInUser() {
    this.loggedInUserData = null;
  }

  getCookiesForLoggedInUser() {
    return this.loggedInUserData;
  }

  setFreshUser () {
    this._isFreshUser.next(true);
  }

  updatePlaylist(data: any) {
    this._PlaylistUpdate.next(data);
  }

  updateUserPlaylist(data: any) {
    this._updateUserPlaylist.next(data);
  }

  setUserLoggedIn(value) {
    this._isUserLogin.next(value);
  }

  isFeaturedDataUpdated(isUpdate) {
    this._isFeatureDataUpdate.next(isUpdate);
  }

  setContentLang(lang) {
    this._contentLang.next(lang);
  }
  
  setAutoplaySwitch(flag:boolean){
    this._queueAutoplaySwitch.next(flag);
    if(flag) this.setPlayerRepeat('Off');
  }

  setSongsToRemoveFromAutoplayQueue(songs: Array<string>){
    this._songsToRemoveFromAutoplayQueue.next(songs);
  }

  // incase of PLAY ALL
  top500SongToQueue(top500Songs) {
    // let currentSongObject = new CurrentSong(top500Songs, 'PLAY_SONG', true, '', '', '');
    // this.addSong(currentSongObject, true);
    // this.setPlayerRepeat('Off');
  }

  queuePopupAB(variantNo){
    switch(variantNo) {
      case '1':
        this.queuePopupDisplay(true);
        this.platformNavigation.pushState({navigationId: "queue_open"}, null, location.href);
        break;
      case '2':
        if(this.queueWasEmpty) {
          this.queuePopupDisplay(true);
          this.platformNavigation.pushState({navigationId: "queue_open"}, null, location.href);
        }
        break;
      default:
    }
  }

  queuePopupDisplay(isShow: boolean) {
    this.isShowQueue = isShow;
    this._queuePopup.next(this.isShowQueue);
  }

  setSongIconClickedAt(clickTime) {
    this.songIconClickedAt = clickTime;
  }

  getSongIconClickedAt() {
    return this.songIconClickedAt;
  }

  setRplList(list: Array<{}>) {
    this.rplList.next(list);
    if(list.length === 0){
      this._localStorageWrapperService.setItemSessionStorage("rpl", JSON.stringify([]));
    }
  }

  insertRplSong(song: any) {
    let LRU_length = 5;
    this.rplSongList = this.rplSongList.filter((e: any) => e.id !== song.id);
    this.rplSongList.unshift(song);
    if (this.rplSongList.length > LRU_length) {
      this.rplSongList = this.rplSongList.slice(0, LRU_length);
    }
    this._localStorageWrapperService.setItemSessionStorage("rpl", JSON.stringify(this.rplSongList));
    this.rplList.next(this.rplSongList);
  }

  addSongToNext(song: any){
    const index = this.queuedSongList.findIndex(
      e => e.id === song.currentSong.id
    );
    if (index != -1) {
      this.queuedSongList.splice(index, 1);
    }
    const current_playing_index = this.queuedSongList.findIndex(
      e => e.id === this._currentPlayingSong.value.song.id
    );
    this.queuedSongList.splice(current_playing_index+1, 0, song.currentSong);
    song.insertAtPos = current_playing_index + 1;
    this.setNewItem(song);
    this.setQueues(this.queuedSongList);
  }

  shuffleQueue(){
    let array = [...this.queuedSongList];
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    this.setQueues(array);
    this.setControlsTrigger({shuffle: true});
  }

  setSoundQuality(quality: string){
    this._soundQuality.next(quality);
    this._localStorageWrapperService.setItem("quality", quality);
  }
  
}
