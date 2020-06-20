import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from '../../../pipes/pipe.module';
import { ImageLazyLoadModule } from '../../../directives/image-lazy-load/image-lazy-load.module';
import { RouterModule } from '@angular/router';
import { CircleGridComponent } from './circle-grid.component';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    RouterModule,
    ImageLazyLoadModule
  ],
  declarations: [CircleGridComponent],
  exports: [CircleGridComponent]
})
export class CircleGridModule { }
