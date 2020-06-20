import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Analytics } from '../../../analytics/analytics';
import { LoaderService } from '../../../shared/services/loader.service';

import { LowerCasePipe } from '@angular/common';
import { ReplaceWhiteSpace } from '../../../pipes/replaceWhitespacePipe/replace-whitespace.pipe';
import { ReplaceCpIds } from '../../../pipes/replaceCpIdsPipe/replace-cp-ids.pipe';
import { LocalStorageWrapperService } from '../../../shared/services/localstorage-wrapper.service';
import { FollowedDataService } from '../../../shared/services/followed-data.service';
import { Subscription } from 'rxjs';
import { Constants } from '../../../constant/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-horizontal-grid',
  templateUrl: 'single-horizontal-grid.component.html',
  styleUrls: ['single-horizontal-grid.component.scss']
})
export class SingleHorizontalGridComponent implements OnChanges,OnInit, OnDestroy {

  @Input() inputData: any;  
  @Input() showSeeAll: boolean;
  @Input() viewType: String;
  @Input() isSearch: boolean;
  @Input() searchData: Object;
  @Input() railIndex: number;
  @Input() searchFilter: string;
  @Input() queryParams:string;
  @Input() type: string;
  @Input() lang: string;
  @Output() singleHorizontalGridClickedEvent = new EventEmitter();
  @Output() singleHorizontalGridShareClicked = new EventEmitter();
  @Output() singleHorizontalGridOverflowClicked = new EventEmitter();
  @Output() singleHorizontalGridSeeAllClicked = new EventEmitter();
  @Output() singleHorizontalGridScollEvent = new EventEmitter();
  @Output() loadMoreSongs = new EventEmitter();
  @Input() screenId: string;
  @Input() recommendationElCount: number;
  @Input() customType: any = null;
  @Input() currentLanguage: any = null;

  public mobileViewForPlaylist: boolean = false;
  public hideRightRailArrow: boolean = false;
  public hideLeftRailArrow: boolean = true;
  private addElRail = true;
  public el: any = null;
  public artistMap: any = {};
  public artistMapSubscriber: Subscription;
  public isCollapsed:boolean =true;
  public languageMap: any = null;
  public languageMapKeyArray: any = null;
  public langTypeMap : any = {
    "ALBUMS":'album_package_id',
    "SONGS":'song_package_id',
    "PLAYLISTS":'playlist_package_id'
  }
  public isArtist : boolean = false;
  public  gridTypesArray : any = Constants.ITEM_TYPES_ARRAY;
  public isGrid: boolean = true;
  public seeAllLink : any = null;

  constructor(
    private commonService: CommonService,
    private analytics: Analytics,
    private loaderService: LoaderService,
    private _localStorageWrapperService: LocalStorageWrapperService,
    private followDataService: FollowedDataService,
    private router:Router
  ) {     
  }

  ngOnInit() {
    this.updateViewWithRespComp();
    this.artistMap = this.followDataService.artistMap;
    this.artistMapSubscriber = this.followDataService.artistMap$.subscribe((res) => {
      this.artistMap = res;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateViewWithRespComp();
    const inputData: SimpleChange = changes.inputData;
    if(inputData && this.inputData){  
      if( this.inputData.seeAllLink) {
        this.seeAllLink=this.inputData.seeAllLink;
      }else if(this.showSeeAll && this.type==="ALBUM"){       
        this.seeAllLink="/music/albums/"+this.lang;
      }
      else if(this.showSeeAll && this.inputData.type!=='RECO' && !this.searchData){      
          this.seeAllLink = this.isGrid ?this.getUrlByListing('LIST'):this.getUrlByListing(this.inputData.type);        
      }                 
      }
    }
  
  getUrlByListing(listingType){
    return "/music/" +
    new LowerCasePipe().transform(listingType) +
    "/" +
    new ReplaceWhiteSpace().transform(this.inputData.title).toLowerCase() +
    "/" +
    new ReplaceCpIds(this._localStorageWrapperService).transform(this.inputData.id, '');

  }

  ngAfterViewInit() {      
    if (!this.el && !this._localStorageWrapperService.isPlatformServer()) {
      setTimeout(() => {
        this.inputData ? this.el = document.getElementById(this.inputData.id):'';
        if (this.el && this.el.scrollWidth - this.el.clientWidth <= 1) {
          this.hideRightRailArrow = true;
          this.hideLeftRailArrow = true;
          return;
        }
      }, 0);
    }
  }

  updateViewWithRespComp() {        
    if (this.viewType === 'GRIDVIEW') {
      if (this.commonService.modifyMobileView()) {
        this.mobileViewForPlaylist = true;
        this.inputData && this.inputData.items.length > 4 ? this.inputData.items = this.inputData.items.slice(0, 4) : '';
      } else {
        this.inputData && this.inputData.items.length > 15 ? this.inputData.items = this.inputData.items.slice(0, 15) : '';
      }
    }
  }

  singleHorizontalGridClicked(song, index) {
    this.singleHorizontalGridClickedEvent.emit();
    this.inputData.id === 'Related Playlists' ? song.type = 'PLAYLIST' : '';
    if (this.isSearch && this.searchData) {
      this.commonService.storeSearchData(this.searchData);
      this.analytics.addSearchResultSingleClickAnalitics(song, index, this.railIndex);
      this.analytics.addSearchResultMoreClickAnalitics(this.searchData, this.inputData, this.railIndex);
    }
    if (
      this.commonService.modifyMobileView()
      || song.type != 'SONG'
      || this.isSearch && song.type != 'SONG'
    ) { 
      if(this.inputData.railType==="MOOD"){
        this.commonService.navigateToMood(song)
      }else 
        this.commonService.navigateToRoute(song);
     }
  }

  followUnfollowClick(artistItem, ev) {
    const { id, title, type, smallImage } = artistItem;
    
    let followObject  = {id, title, smallImage, type};
    
    if (!this.artistMap[id]) {
      this.followDataService.follow(id, type, title, followObject);
    } else {
      this.followDataService.unfollow(id, type, title);
    }
    ev.stopPropagation();
  }

  addSearchResultMoreClick() {
    this.commonService.storeSearchData(this.searchData);
    this.analytics.addSearchResultMoreClickAnalitics(this.searchData, this.inputData, this.railIndex);
  }

  shareSongEvent(val) {
    this.singleHorizontalGridShareClicked.emit(val)
  }

  overflowSongEvent(val) {
    this.singleHorizontalGridOverflowClicked.emit({ action: 'add-to-playlist', info: val });
  }

  showMore() {
    this.loaderService.loaderState(true);
    this.loadMoreSongs.emit();
  }

  scrollGridRail(ev, data) {
    this.checkHideRailArrow();
    this.singleHorizontalGridScollEvent.emit(data);
  }

  scrollRailLeft(id) {
    this.commonService.scrollRailLeft(id, 120);
    this.checkHideRailArrow();
  }

  scrollRailRight(id) {
    this.commonService.scrollRailRight(id, 120);
    this.checkHideRailArrow();
  }

  checkHideRailArrow() {
    const pos = this.el.scrollLeft + this.el.offsetWidth;
    const max = this.el.scrollWidth;
    if (pos >= max) {
      this.hideRightRailArrow = true;
      this.hideLeftRailArrow = false;
      if (this.addElRail) {
        this.addElRail = false;
        let iDIV = document.createElement('div');
        document.getElementById(this.inputData.id).appendChild(iDIV).style.paddingRight = "110px";
      }
    } else if (pos == this.el.offsetWidth) {
      this.hideLeftRailArrow = true;
      this.hideRightRailArrow = false;
    } else {
      this.hideRightRailArrow = false;
      this.hideLeftRailArrow = false;
    }
  }

  seeAllClicked() {
    this.singleHorizontalGridSeeAllClicked.emit();
  }

  navigateToPage() {
    if(this.seeAllLink && this.showSeeAll && this.inputData.items.length > 6){    
      this.router.navigate([this.seeAllLink])
      return;
    }
    
    if (this.commonService.modifyMobileView() && this.showSeeAll && this.inputData.items.length >= 4 ||
      !this.commonService.modifyMobileView() && this.showSeeAll && this.inputData.items.length > 6) {
      if (this.inputData && this.inputData.type === 'RECO') {
        this.inputData.seeAllLink = "/music/my-music/" + new ReplaceWhiteSpace().transform(this.inputData.title).toLowerCase();
      }else if(this.inputData && this.type==='ALBUM')
        this.inputData.seeAllLink="/music/albums/"+this.lang;
      else if (!this.isSearch && !this.inputData.seeAllLink) {
        this.inputData.seeAllLink = "/music/" +
          new LowerCasePipe().transform(this.inputData.type) +
          "/" +
          new ReplaceWhiteSpace().transform(this.inputData.title).toLowerCase() +
          "/" +
          new ReplaceCpIds(this._localStorageWrapperService).transform(this.inputData.id, this.inputData.title)
          ;
        this.inputData.queryParams = { page: 0 };
      }
      else if (this.isSearch && !this.inputData.seeAllLink) {
        this.inputData.seeAllLink = "/music/packagesearch";
        this.inputData.queryParams = { q: this.searchData, filter: this.inputData.id, page: 0 }
      }
      this.commonService.navigateToRoute(this.inputData);
    }
  }

  ngOnDestroy() {
    if (this.artistMapSubscriber) {
      this.artistMapSubscriber.unsubscribe();
    }
  }
}
