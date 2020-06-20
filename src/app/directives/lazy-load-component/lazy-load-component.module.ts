import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyLoadComponentDirective } from './lazy-load-component.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LazyLoadComponentDirective],
  exports: [LazyLoadComponentDirective]
})
export class LazyLoadComponentModule { }
