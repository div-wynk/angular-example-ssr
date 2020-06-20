import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RectGrid2x6Component } from './rect-grid-2x6.component';
import { PipeModule } from '../../../pipes/pipe.module';
import { ImageLazyLoadModule } from '../../../directives/image-lazy-load/image-lazy-load.module';
import { RouterModule } from '@angular/router';
import { HoverStateModule } from '../../hover-state/hover-state.module';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    RouterModule,
    ImageLazyLoadModule,
    HoverStateModule
  ],
  declarations: [RectGrid2x6Component],
  exports: [RectGrid2x6Component]
})
export class RectGrid2x6Module { }
