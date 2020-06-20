/**
 * Created by Harish Chandra.
 */
import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit
} from "@angular/core";
import { CommonService } from "../../shared/services/common.service";
import { IconThemePipe } from "../../pipes/iconThemePipe/iconThemePipe";
import { Subscription } from "rxjs";

@Directive({
  selector: "img[appImgLazyLoad]",
  host: {
    "(error)": "updateUrl()"
  }
})
export class LazyLoadDirective implements OnInit,OnChanges {
  public _isBanner = false;
  public artistsIcon: string;
  public playlistsIcon: string;
  public bannerIcon: string;
  public theme: string;

  @Input()
  set isBanner(isBanner) {
    this._isBanner = isBanner;
  }

  get isBanner() {
    return this._isBanner;
  }
  
  
  @HostBinding("attr.src")
  srcAttr = "";
  @Input()
  src: string;
  @Input()
  isArtist: boolean = false;
  public themeSubscription: Subscription;

  constructor(private el: ElementRef, private commonService: CommonService) {    
  }

  ngOnInit() {   
  }

  ngOnChanges(changes: SimpleChanges){            
    this.themeSubscription = this.commonService.theme$.subscribe((res)=>{
      this.theme = res;
    
    this.artistsIcon = new IconThemePipe().transform("artistsIcon",this.theme);
    this.playlistsIcon = new IconThemePipe().transform("playlistsIcon",this.theme);
    this.bannerIcon = new IconThemePipe().transform("bannerIcon",this.theme);
    if(!this._isBanner)
      this.srcAttr = this.isArtist ? "./" + this.artistsIcon : "./" + this.playlistsIcon;
     else 
      this.srcAttr = "./" + this.bannerIcon;
    
    if(changes.src && changes.src.currentValue){
      this.src = changes.src.currentValue;
      this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
    }
    })
  }


  private canLazyLoad() {
    return window && "IntersectionObserver" in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
        if (this.commonService.isUCBrowser() || isIntersecting === undefined ) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
        // if(this.commonService.isChrome()){
        //   this.loadImage();
        //   obs.unobserve(this.el.nativeElement);
        // }
        // if(this.commonService.isOpera()){
        //   this.loadImage();
        //   obs.unobserve(this.el.nativeElement);
        // }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  updateUrl() {
    this.themeSubscription = this.commonService.theme$.subscribe(()=>{
    this.artistsIcon = new IconThemePipe().transform("artistsIcon",this.theme);
    this.playlistsIcon = new IconThemePipe().transform("playlistsIcon",this.theme);
    this.bannerIcon = new IconThemePipe().transform("bannerIcon",this.theme);
      if(!this._isBanner){
        this.srcAttr = this.isArtist ? "./" + this.artistsIcon : "./" + this.playlistsIcon;
      } else {
        this.srcAttr = "./" + this.bannerIcon;
      }
    })
    
    
  }
  private loadImage() {
    this.srcAttr = this.src;
  }
  ngOnDestroy(){
    if(this.themeSubscription){
      this.themeSubscription.unsubscribe()
    }
  }
}
