import { Component, Input, Output, EventEmitter } from '@angular/core';
  
import { LowerCasePipe } from '@angular/common';
  
import { LocalStorageWrapperService } from '../../../../shared/services/localstorage-wrapper.service';
import { ReplaceCpIds } from '../../../../pipes/replaceCpIdsPipe/replace-cp-ids.pipe';
import { ReplaceWhiteSpace } from '../../../../pipes/replaceWhitespacePipe/replace-whitespace.pipe';
import { Analytics } from '../../../../analytics/analytics';
import { CommonService } from '../../../../shared/services/common.service';
  
@Component({
  selector: 'app-single-song-grid',
  templateUrl: 'single-song-grid.component.html',
  styleUrls: ['single-song-grid.component.scss']
})

export class SingleSongGridComponent  {
  
  @Input() showSeeAll: boolean;
  @Input() searchData: Object;
  @Input() isSearch: boolean;
  @Input() searchFilter: string;
  @Output() singleHorizontalGridShareClicked = new EventEmitter();
  @Output() singleHorizontalGridOverflowClicked = new EventEmitter();
  @Output() singleHorizontalGridSeeAllClicked = new EventEmitter();
  @Output() singleHorizontalGridScollEvent = new EventEmitter();
  @Input() recommendationElCount: number;

    @Input() inputData: any;  
    @Input() viewType: String;
    @Input() railIndex: number;
    @Output() singleHorizontalGridClickedEvent = new EventEmitter();
    @Output() loadMoreSongs = new EventEmitter();
    @Input() screenId: string;
    @Input() customType: any = null;
    @Input() currentLanguage: any = null;
  
    public isCollapsed:boolean =true;
    public languageMap: any = null;
    public languageMapKeyArray: any = null;
    public langTypeMap : any = {
      "ALBUMS":'album_package_id',
      "SONGS":'song_package_id',
      "PLAYLISTS":'playlist_package_id'
    }
  
    constructor(
      private commonService: CommonService,
      private analytics: Analytics,
      private _localStorageWrapperService: LocalStorageWrapperService,
    ) { 
    }
  
    singleHorizontalGridClicked(song, index) {
      this.singleHorizontalGridClickedEvent.emit();
      if (
        this.commonService.modifyMobileView()
        || song.type != 'SONG'
        || this.isSearch && song.type != 'SONG'
      ) { this.commonService.navigateToRoute(song); }
    }
  
    shareSongEvent(val) {
      this.singleHorizontalGridShareClicked.emit(val)
    }
  
    overflowSongEvent(val) {
      this.singleHorizontalGridOverflowClicked.emit({ action: 'add-to-playlist', info: val });
    }
  
    showMore() {
      this.loadMoreSongs.emit();
    }  
  
    navigateToPage() {
      if (this.commonService.modifyMobileView() && this.showSeeAll && this.inputData.items.length >= 4 ||
        !this.commonService.modifyMobileView() && this.showSeeAll && this.inputData.items.length > 6) {
        if (this.inputData && this.inputData.type === 'RECO') {
          this.inputData.seeAllLink = "/music/my-music/" + new ReplaceWhiteSpace().transform(this.inputData.title).toLowerCase();
        } else if ( !this.inputData.seeAllLink) {
          this.inputData.seeAllLink = "/music/" +
            new LowerCasePipe().transform(this.inputData.type) +
            "/" +
            new ReplaceWhiteSpace().transform(this.inputData.title).toLowerCase() +
            "/" +
            new ReplaceCpIds(this._localStorageWrapperService).transform(this.inputData.id, this.inputData.title)
            ;
          this.inputData.queryParams = { page: 0 };
        }
        this.commonService.navigateToRoute(this.inputData);
      }
    }
  
    ngOnDestroy() {
    }
  }
  