import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { CurrentSong } from '../../../models/current-song.model';
import { PersistDataService } from '../../../shared/services/persistData.service';

@Component({
  selector: 'app-rect-grid-2x6',
  templateUrl: 'rect-grid-2x6.component.html',
  styleUrls: ['rect-grid-2x6.component.scss']
})
export class RectGrid2x6Component implements OnInit {

  @Input() inputData: any;
  @Input() showSeeAll: boolean;
  @Output() loadMoreSongs = new EventEmitter();
  @Input() viewType: string;
  @Input() screenId: string;
  @Output() rectGrid2x6ClickedEvent = new EventEmitter();
  @Output() rectGrid2x6ShareClicked = new EventEmitter();
  @Output() rectGrid2x6OverflowClicked = new EventEmitter();
  modifyMobileView: boolean;

  constructor(
    private commonService: CommonService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.modifyMobileView = this.commonService.modifyMobileView();
  }

  showMore() {
    this.loaderService.loaderState(true);
    this.loadMoreSongs.emit();
  }

  rectGrid2x6Clicked(song) {
    this.rectGrid2x6ClickedEvent.emit(song);
  }

  navigateToSongPage(song){
    this.commonService.navigateToRoute(song);
  }

  shareSongEvent(val) {
    this.rectGrid2x6ShareClicked.emit(val)
  }

  overflowSongEvent(val) {
    this.rectGrid2x6OverflowClicked.emit({ action: 'add-to-playlist', info: val });
  }

  slideLeftRight(ev, id) {
    this.commonService.slideLeftRight(ev, id);
  }

}
