import { Injectable } from '@angular/core';
import { HttpRequestManager } from '../../http-manager/http-manager.service';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constant/constants';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { LocalStorageWrapperService } from './localstorage-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  openside: boolean = false;
  private token: string;
  private deviceToken: string;
  private uId: string;
  private playlistTypeArray: any = ['sharedplaylist','package','album'];

  constructor(
    private httpRequestManager: HttpRequestManager,
    private commonService: CommonService,
    private _localStorageWrapperService: LocalStorageWrapperService
  ) {
    this.token = this._localStorageWrapperService.getItem('token');
    this.deviceToken = this._localStorageWrapperService.getItem('device-token');
    this.uId = this._localStorageWrapperService.getItem('uId');
  }

  public openSideBar() {

    if (this.openside) {

      this.openside = false;
    } else {

      this.openside = true;
    }
  }

  getUserContent() {
    let url = '/v2/usercontent';
    return this.httpRequestManager.get(environment.SAPI_URL + url, '', '', '');
  }

  getUserState() {
    let url = '/v2/userstate';
    return this.httpRequestManager.get(environment.SAPI_URL + url, '', '', '');
  }

  getPlaylist(count=48,offset=0) {
    let url = '/music/v2/playlists';
    return this.httpRequestManager.get(environment.USER_CONTENT_URL + url +'?count=' + count + '&offset=' + offset , '', '', '');
  }

  getDownloadedSongIds() {
    return this.getUserState().pipe(
      map((response: any) => {
        return response.userContents
          .filter(x => x.id === 'rentals')[0]
          .contentIds
          .map(content => content.id)
      })
    )
  }

  getRecommendedSongs() {
    let url = `/recommendation/v4/recommended/songs?genres=`;
    return this.httpRequestManager.get(environment.RECOMMANDATION + url, '', '', '');
  }

  getRecommendedArtists(count) {
    let url = `/recommendation/v5/usercontent/smartpackages?id=recommended_artists:${count}&lang=en`;
    return this.httpRequestManager.get(environment.RECOMMANDATION + url, '', '', '');
  }

  getRecommendedPlaylists(count) {
    let url = `/recommendation/v5/usercontent/smartpackages?id=recommended_playlists:${count}&lang=en`;
    return this.httpRequestManager.get(environment.RECOMMANDATION + url, '', '', '');
  }

  getRecommendedContents() {
    let url = `/recommendation/v5/usercontent/smartpackages?id=recommended_songs:${Constants.CONTEXT_LIMIT.RECOMMENDED_RAIL_CONTENT}&id=recommended_artists:${Constants.CONTEXT_LIMIT.RECOMMENDED_RAIL_CONTENT}&id=recommended_playlists:${Constants.CONTEXT_LIMIT.RECOMMENDED_RAIL_CONTENT}&lang=en`;
    return this.httpRequestManager.get(environment.RECOMMANDATION + url, '', '', '');
  }

  getRecentlyPlayedSongIds() {
    let url = '/v4/recent/songs';
    return this.httpRequestManager.get(environment.PLAYLIST_UPDATE + url, '', '', '').pipe(
      map((response: any) => {
        return response.songs.filter(x => x.visibility === true).map(song => song.id)
      })
    )
  }

  myPlaylistDetails(id, offset, count) {
    let langs = this.commonService.getSelectedLanguages();
    return this.httpRequestManager.get(environment.USER_CONTENT_URL + '/usercontent/v4/user/playlist?playlistId=' + id + '&count=' + count + '&offset=' + offset + '&lang=' + langs,
      this.token, this.uId, this.deviceToken);
  }

  getFollowedArtists() {
    let userData = this.commonService.getCookieForLoggedInUser();
    if(userData && userData.uid){      
      let url = Constants.FOLLOWED_ARTIST;
      return this.httpRequestManager.get(environment.GRAPH_URL + url, '', '', '');
    }
  }

  getFollowedData() {
    let userData = this.commonService.getCookieForLoggedInUser();
    if(userData && userData.uid){      
      let url = Constants.FOLLOWED_ALL;
      return this.httpRequestManager.get(environment.GRAPH_URL + url, '', '', '');
    }
  }

  getFollowedPlaylists() {
    let userData = this.commonService.getCookieForLoggedInUser();
    if(userData && userData.uid){      
      let url = Constants.FOLLOWED_PLAYLIST;
      return this.httpRequestManager.get(environment.GRAPH_URL + url, '', '', '');
    }
  }

  follow(id,type ) {
    let userData = this.commonService.getCookieForLoggedInUser();
    if(userData && userData.uid) {
      type = (type.toLowerCase() === 'userplaylist') ? 'sharedplaylist' : type.toLowerCase(); 
      let label = this.playlistTypeArray.includes(type) ? 'playlist' : type;
      let body = [{ userId:userData.uid , idList:[id], type, label, isCurated: type!=='sharedplaylist'}]    
      let url = Constants.FOLLOW_URL; 
      return this.httpRequestManager.post(environment.GRAPH_URL + url, '', body, '', '', '');    
    }
    
  }

  unFollow(id,type) {
    let userData = this.commonService.getCookieForLoggedInUser();
    if(userData && userData.uid) {
      type = (type.toLowerCase() === 'userplaylist') ? 'sharedplaylist' : type.toLowerCase(); 
      let label = this.playlistTypeArray.includes(type) ? 'playlist' : type;
      let body = [{ userId:userData.uid, idList:[id], type, label, isCurated:type!=='sharedplaylist'}]
      let url = Constants.UNFOLLOW_URL; 
      return this.httpRequestManager.post(environment.GRAPH_URL + url, '', body, '', '', '');
    }
  }

}
