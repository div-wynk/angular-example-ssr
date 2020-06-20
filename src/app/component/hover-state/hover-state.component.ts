import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { PersistDataService } from '../../shared/services/persistData.service';

@Component({
  selector: 'app-hover-state',
  templateUrl: 'hover-state.component.html',
  styleUrls: ['hover-state.component.scss']
})
export class HoverStateComponent implements OnInit {

  @Input() songInfo: any;
  @Output() shareSongClickEvent = new EventEmitter();
  @Output() overflowSongClickEvent = new EventEmitter();
  @Input() screenId: string;
  @Input() dropZone: string;
  @Input() isPlaying: boolean = false; 
  @Input('package') featuredRailData: any
  public hoverVisibilityStatus: boolean;

  constructor(private commonService: CommonService, private persistDataService: PersistDataService) { }

  ngOnInit() {
    this.hoverVisibilityStatus = !this.commonService.modifyMobileView();
  }

  shareClick() {
    this.shareSongClickEvent.emit(this.songInfo);
  }

  updatePlaylist() {
    this.overflowSongClickEvent.emit(this.songInfo);
  }

  goToSongPage(event) {
    if(this.featuredRailData.railType==="MOOD" && !['I', 'SPAN'].includes(event.target.nodeName)){
      this.commonService.navigateToMood(this.songInfo);
    }
    else if(!['I', 'SPAN'].includes(event.target.nodeName))
      this.commonService.navigateToRoute(this.songInfo);
  }

  playPlaylistSongs() {
    this.persistDataService.autoPlayPlaylistSong(this.songInfo)
  }

}
