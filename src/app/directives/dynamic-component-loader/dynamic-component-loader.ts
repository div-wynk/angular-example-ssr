import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[search-host]' })
export class DynamicLoaderDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}