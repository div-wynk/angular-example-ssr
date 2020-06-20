import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Analytics } from '../../../analytics/analytics';
import { LowerCasePipe } from '@angular/common';
import { ReplaceWhiteSpace } from '../../../pipes/replaceWhitespacePipe/replace-whitespace.pipe';
import { ReplaceCpIds } from '../../../pipes/replaceCpIdsPipe/replace-cp-ids.pipe';
import { LocalStorageWrapperService } from '../../../shared/services/localstorage-wrapper.service';

@Component({
  selector: 'app-single-horizontal-rail',
  templateUrl: 'single-horizontal-rail.component.html',
  styleUrls: ['single-horizontal-rail.component.scss']
})
export class SingleHorizontalRailComponent implements OnInit, AfterViewInit {

  @Input() inputData: any;
  @Input() viewType: string;
  @Input() showSeeAll: boolean;
  @Input() screenId: string;
  @Input() isSearch: boolean;
  @Input() searchData: Object;
  @Input() railIndex: number;
  @Input() hideHoverState: boolean = false;
  @Output() singleHorizontalRailClickedEvent = new EventEmitter();
  @Output() singleHorizontalRailShareClicked = new EventEmitter();
  @Output() singleHorizontalRailOverflowClicked = new EventEmitter();
  @Output() singleHorizontalRailSeeAllClicked = new EventEmitter();
  @Output() singleHorizontalRailScollEvent = new EventEmitter();

  public hideRightRailArrow: boolean = false;
  public hideLeftRailArrow: boolean = true;
  public el: any = null;
  public modifyMobileView: boolean;
  public railData: Array<Object> = [];
  constructor(
    private commonService: CommonService,
    private analytics: Analytics,
    private _localStorageWrapperService: LocalStorageWrapperService
  ) { }

  ngOnInit() {
    if (this.viewType === 'GRIDVIEW' && this.inputData.items.length > 15) {
      this.railData = this.inputData.items.slice(0, 15);
    }else{
      this.railData = this.inputData.items;
    }
    this.modifyMobileView = this.commonService.modifyMobileView();
  }

  ngAfterViewInit() {
    if (!this.el) {
      setTimeout(() => {
        this.el = document.getElementById(this.inputData.id);
        if (this.el && this.el.scrollWidth - this.el.clientWidth <= 1) {
          this.hideRightRailArrow = true;
          this.hideLeftRailArrow = true;
          return;
        }
      }, 0)
    }
  }

  addSearchResultMoreClick() {
    this.commonService.storeSearchData(this.searchData);
    this.analytics.addSearchResultMoreClickAnalitics(this.searchData, this.inputData, this.railIndex);
  }

  singleHorizontalRailClicked(song, index) {
    this.singleHorizontalRailClickedEvent.emit(song);
    if (this.isSearch) {
      this.commonService.storeSearchData(this.searchData);
      this.analytics.addSearchResultSingleClickAnalitics(song, index, this.railIndex);
      this.analytics.addSearchResultMoreClickAnalitics(this.searchData, this.inputData, this.railIndex);
    }
  }

  navigateToSongPage(song) {
    if (this.isSearch) {
      this.commonService.storeSearchData(this.searchData);
    }
    this.commonService.navigateToRoute(song);
  }

  shareSongEvent(val: {}) {
    this.singleHorizontalRailShareClicked.emit(val)
  }

  overflowSongEvent(val: any) {
    this.singleHorizontalRailOverflowClicked.emit({ action: 'add-to-playlist', info: val });
  }

  slideLeftRight(ev, data) {
    this.commonService.slideLeftRight(ev, data.id);
    this.checkHideRailArrow();
    this.singleHorizontalRailScollEvent.emit(data);
  }

  scrollRailLeft(id) {
    this.commonService.scrollRailLeft(id, 135);
    this.checkHideRailArrow();
  }
  scrollRailRight(id) {
    this.commonService.scrollRailRight(id, 135);
    this.checkHideRailArrow();
  }

  checkHideRailArrow() {
    const pos = this.el.scrollLeft + this.el.offsetWidth;
    const max = this.el.scrollWidth;
    if (pos >= max - 1) {
      this.hideRightRailArrow = true;
      this.hideLeftRailArrow = false;
    } else if (pos == this.el.offsetWidth) {
      this.hideLeftRailArrow = true;
      this.hideRightRailArrow = false;
    } else {
      this.hideRightRailArrow = false;
      this.hideLeftRailArrow = false;
    }
  }

  seeAllClicked() {
    this.singleHorizontalRailSeeAllClicked.emit();
  }

  navigateToPage() {
    if (this.showSeeAll && this.inputData.items.length > 8) {
      if (this.inputData && this.inputData.type === 'RECO') {
        this.inputData.seeAllLink = "/music/my-music/" + new ReplaceWhiteSpace().transform(this.inputData.title).toLowerCase();
      } else if (!this.isSearch && !this.inputData.seeAllLink) {
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

}
