import { Injectable } from '@angular/core';
import { HttpRequestManager } from '../../http-manager/http-manager.service';
import { Subject } from 'rxjs';
import { Constants } from '../../constant/constants';
import { environment } from '../../../environments/environment';
import { LocalStorageWrapperService } from './localstorage-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class TvMapService {  
  public albums: any = {};
  public TV_MAP_URL = Constants.TV_MAP_URL;
  private _albums = new Subject<any>();
  public albums$ = this._albums.asObservable();


  constructor(public httpManager: HttpRequestManager, private _localStorageWrapperService: LocalStorageWrapperService) {
    if(this._localStorageWrapperService.isPlatformServer())
      this.TV_MAP_URL = environment.SSR_URL + this.TV_MAP_URL;
    this.httpManager.getWithoutHeader(this.TV_MAP_URL).subscribe( res => {      
      this.albums = res || {};
      this._albums.next(this.albums);
    })
  } 
}
