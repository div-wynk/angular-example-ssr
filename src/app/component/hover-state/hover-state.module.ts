import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoverStateComponent } from './hover-state.component';
import { PopoverModule } from '../popover/popover.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PlaySongModule } from '../../directives/player/play-song.module';
// import { PlayNextModule } from '../../directives/play-next/play-next.module';

@NgModule({
  imports: [
    CommonModule,
    PopoverModule,
    NgbModule
  ],
  declarations: [HoverStateComponent],
  exports: [HoverStateComponent]
})
export class HoverStateModule { }