import { Directive, Output, EventEmitter, ElementRef, Input, SimpleChanges } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';

@Directive({
  selector: '[appLazyLoadComponent]'
})
export class LazyLoadComponentDirective {
  @Output() public loadMore: EventEmitter<any> = new EventEmitter();
  @Input() private scrollThrottle = 0; 
  @Input() key:string;

  constructor(
    private el: ElementRef,
    private commonService: CommonService,
    private _localStorageWrapperService: LocalStorageWrapperService
  ) {  }

  ngOnChanges(changes: SimpleChanges) {
    if( changes.key && changes.key.currentValue != changes.key.previousValue){
      if(this._localStorageWrapperService.isPlatformServer()){
        this.loadMore.emit();
      }
      else{
        this.canLazyLoad() ? this.lazyLoad() : this.loadMore.emit();
       }
    }
  }

  lazyLoad() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadMore.emit();
          obs.unobserve(this.el.nativeElement);
          obs.disconnect();
        }
        if (this.commonService.isUCBrowser() || isIntersecting === undefined) {
          this.loadMore.emit();
          obs.unobserve(this.el.nativeElement);
        }
      });
    },{"threshold": this.scrollThrottle});
    obs.observe(this.el.nativeElement);
  }

  canLazyLoad() {    
    return window && "IntersectionObserver" in window;
  }

}
