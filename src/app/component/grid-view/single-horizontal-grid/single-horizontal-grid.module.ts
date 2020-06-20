import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleHorizontalGridComponent } from './single-horizontal-grid.component';
import { PipeModule } from '../../../pipes/pipe.module';
import { RouterModule } from '@angular/router';
import { ImageLazyLoadModule } from '../../../directives/image-lazy-load/image-lazy-load.module';
import { HoverStateModule } from '../../hover-state/hover-state.module';
import { SingleSongGridComponent } from './single-song-grid/single-song-grid.component';
import { FilterListComponent } from './filter-list/filter-list.component';
@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    RouterModule,
    ImageLazyLoadModule,
    HoverStateModule
  ],
  declarations: [SingleHorizontalGridComponent,SingleSongGridComponent,FilterListComponent],
  exports:[SingleHorizontalGridComponent,FilterListComponent,SingleSongGridComponent]
})
export class SingleHorizontalGridModule { }
