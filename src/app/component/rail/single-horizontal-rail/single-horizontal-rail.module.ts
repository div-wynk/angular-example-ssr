import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleHorizontalRailComponent } from './single-horizontal-rail.component';
import { RouterModule } from '@angular/router';
import { PipeModule } from '../../../pipes/pipe.module';
import { ImageLazyLoadModule } from '../../../directives/image-lazy-load/image-lazy-load.module';
import { HoverStateModule } from '../../hover-state/hover-state.module';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    RouterModule,
    ImageLazyLoadModule,
    HoverStateModule
  ],
  declarations: [SingleHorizontalRailComponent],
  exports:[SingleHorizontalRailComponent]
})
export class SingleHorizontalRailModule { }
