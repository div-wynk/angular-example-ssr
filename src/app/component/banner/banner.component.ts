/**
* Created by Harish Chandra.
*/
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-banner',
  templateUrl: 'banner.component.html',
  styleUrls: ['banner.component.scss'],
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() inputImages: any
  public circularBannerImage: any;
  public isLyfPhone: any = false;
  bodyWidth: any;
  imageWidth: any;
  totalImageWidth: any;
  scrolledWidth: any;
  bannerInterval: any;

  constructor( public _localStorageWrapperService: LocalStorageWrapperService, private commonService: CommonService) {    
  }

  ngOnInit() {
    if(!this._localStorageWrapperService.isPlatformServer()){
      this.isLyfPhone = this.commonService.isLyfPhone();
    }
    this.updateBannerImages(this.inputImages);
    this.computeImageWidth();
  }

  ngAfterViewInit(){
    this.computeCarousel();
  }

  computeImageWidth() {
    if(!this._localStorageWrapperService.isPlatformServer()){
      if (this.commonService.modifyMobileView()) {
        let outerWidth = document.body.clientWidth - 40;
        this.imageWidth = outerWidth > 1400 ? 1400 : outerWidth;
      } else {
        let outerWidth = document.body.clientWidth - 200;
        this.imageWidth = outerWidth > 900 ? 900 : outerWidth;
      }
    }
  }

  ngOnChanges() {
    if (this.circularBannerImage && this.circularBannerImage.length > 0) {
      this.updateBannerImages(this.inputImages);
      this.computeCarousel();
    }
  }

  updateBannerImages(data) {
    this.circularBannerImage = [...data[0].items, ...data[0].items.slice(0, 3)];
  }


  computeCarousel() {
    if(this._localStorageWrapperService.isPlatformServer()){
      return null;
    }
    if (this.bannerInterval)
      clearInterval(this.bannerInterval);
    this.bodyWidth = document.body.clientWidth;
    let itemsDiv = document.getElementById('items') as HTMLElement;
    if(itemsDiv){
      itemsDiv.style.width = (this.imageWidth * this.circularBannerImage.length) + "px";
      itemsDiv.style.transform = "translate3d(-" + this.imageWidth + "px,0,0)";
      setTimeout(() => {
        itemsDiv.classList.add('horizTranslate');
      }, 0);
    }
    this.totalImageWidth = this.imageWidth * (this.circularBannerImage.length - 1);
    this.scrolledWidth = this.imageWidth;
    this.startInterval();
  }
  

  startInterval() {
    this.bannerInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  prev() {
    let bannerWrapper = document.querySelector('.bannerWrapper');
    if(!bannerWrapper) return;
    clearInterval(this.bannerInterval);
    let itemsDiv = document.getElementById('items') as HTMLElement;
    let outerWidth = bannerWrapper.clientWidth;
    if ((this.scrolledWidth - outerWidth) <= 0) {
      itemsDiv.classList.remove('horizTranslate');
      this.scrolledWidth = this.totalImageWidth - outerWidth;
      itemsDiv.style.transform = "translate3d(-" + this.scrolledWidth + "px,0,0)";
      this.scrolledWidth -= outerWidth;
      setTimeout(() => {
        itemsDiv.classList.add('horizTranslate');
        itemsDiv.style.transform = "translate3d(-" + (this.scrolledWidth) + "px,0px,0px)";
        this.startInterval();
      }, 0);
    } else {
      this.scrolledWidth -= outerWidth
      itemsDiv.style.transform = "translate3d(-" + (this.scrolledWidth) + "px,0px,0px)";
      this.startInterval();
    }
  }

  next() {
    let bannerWrapper = document.querySelector('.bannerWrapper');
    if(!bannerWrapper) return;
    clearInterval(this.bannerInterval);
    let itemsDiv = document.getElementById('items') as HTMLElement;
    let outerWidth = bannerWrapper.clientWidth;
    if ((this.scrolledWidth + outerWidth) >= this.totalImageWidth) {
      itemsDiv.classList.remove('horizTranslate');
      this.scrolledWidth = outerWidth;
      itemsDiv.style.transform = "translate3d(-" + this.scrolledWidth + "px,0,0)";
      this.scrolledWidth += outerWidth;
      setTimeout(() => {
        itemsDiv.classList.add('horizTranslate');
        itemsDiv.style.transform = "translate3d(-" + (this.scrolledWidth) + "px,0px,0px)";
        this.startInterval();
      }, 0);
    } else {
      this.scrolledWidth += outerWidth;
      itemsDiv.style.transform = "translate3d(-" + (this.scrolledWidth) + "px,0px,0px)";
      this.startInterval();
    }
  }

  imageSwipe(event) {
    if (event.deltaX > 0) {
      this.prev();
    } else if (event.deltaX < 0) {
      this.next();
    }
  }

  ngOnDestroy() {
    if (this.bannerInterval)
      clearInterval(this.bannerInterval);
  }

}