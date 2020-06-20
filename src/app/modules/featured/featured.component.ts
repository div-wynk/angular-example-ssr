import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { PersistDataService } from '../../shared/services/persistData.service';
import { Constants } from '../../constant/constants';
import { MetaTagService } from '../../shared/services/metatag.service';
import { Analytics } from '../../analytics/analytics';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { ModalPopupService } from '../../shared/services/modal-popup.service';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { HomeService } from '../home/service/home.component.service';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs';
// import { DfpAdMetaMap } from '../dfp/models/dfp-ad-meta-map.model';

@Component({
    selector: 'app-featured',
    templateUrl: 'featured.component.html',
})

export class FeaturedComponent implements OnInit, AfterViewInit {
    public featuredData: any;
    public featuredRail = [];
    public tempData = [];
    private metaTags = [];
    public intialInx = 0;
    public lastInx = 1;
    private isRailScrolling: any;
    public  gridTypesArray: any = Constants.ITEM_TYPES_ARRAY;
    private featuredDataSubscription: Subscription;
    public lazyLoadKey: string;
    // tslint:disable-next-line: max-line-length
    // public adMetaMap: DfpAdMetaMap = {data:[{type:'DFP_AD',slotId:'dfp_ad_music_home_slot_3',adUnit:'/417241724/Wynk_Mweb_Home_Slot_3',collapseIfEmpty:true,interval:60000,sizes:[[320,100],[320,75],[320,50]],targetings:[]},{type:'DFP_AD',slotId:'dfp_ad_music_home_slot_5',adUnit:'/417241724/Wynk_Mweb_Home_Slot_5',collapseIfEmpty:true,interval:60000,sizes:[[320,100],[320,75],[320,50]],targetings:[]},{type:'DFP_AD',slotId:'dfp_ad_music_home_slot_7',adUnit:'/417241724/Wynk_Mweb_Home_Slot_7',collapseIfEmpty:true,interval:60000,sizes:[[320,100],[320,75],[320,50]],targetings:[]},{type:'DFP_AD',slotId:'dfp_ad_music_home_slot_9',adUnit:'/417241724/Wynk_Mweb_Home_Slot_9',collapseIfEmpty:true,interval:60000,sizes:[[320,100],[320,75],[320,50]],targetings:[]},{type:'DFP_AD',slotId:'dfp_ad_music_home_slot_11',adUnit:'/417241724/Wynk_Mweb_Home_Slot_11',collapseIfEmpty:true,interval:60000,sizes:[[320,100],[320,75],[320,50]],targetings:[]}],positions:[2,4,6,8,10]};

    constructor(
        private persistDataService: PersistDataService,
        private metaService: MetaTagService,
        private modalPopupService: ModalPopupService,
        private analytics: Analytics,
        private _renderer2: Renderer2,
        public router: Router,
        private commonService: CommonService,
        private _localStorageWrapperService: LocalStorageWrapperService,
        private homeService: HomeService,
        private platformNavigation: PlatformLocation

    ) {
        console.log("feature cons");
        
        this.commonService.setCurrentPageUrl();
        this.pageLoadEvent();
        this.persistDataService.isFreshUser$.subscribe(res => {
            if (res) {
              this.pageLoadEvent();
            }
        }); 
        this.platformNavigation.onPopState(() => {
            this.commonService.backClicked = true;
        });
    }

    ngOnInit() {
        console.log("featured")
        this.lazyLoadKey = 'homepage';
        this.homeService.checkAndUpdateFeatureData();
        this.featuredDataSubscription =  this.persistDataService.featuredData$.subscribe(res => {
            this.lazyLoadKey += (Math.random() * 1000).toFixed();
            const len = this.commonService.featuredArray;
            this.intialInx = 0;
            if (this.commonService.backClicked && len > 0) {
                this.lastInx = len;
            } else {
                this.commonService.scrollToTop();
                this.commonService.featuredArray = -1;
                this.lastInx = 1;
            }
            this.featuredPageData(res);
            this.setMetaTags(res);
        });
        this.isFeauturedDataUpdated();
    }

    ngAfterViewInit() {
        if (this.commonService.backClicked) {
            window.scrollTo(0, this.commonService.scrollPos);
        }
    }

    isFeauturedDataUpdated() {
        this.persistDataService.isFeatureDataUpdate$.subscribe(res => {
            if (res) {
                this.homeService.getDefaultFeaturedData();
            } else {
                this.homeService.getConfig().subscribe(response => {
                    this.commonService.setUserDetailsObj(response);
                    this._localStorageWrapperService.setItem('config', JSON.stringify(response));
                    this.homeService.getDefaultFeaturedData();
                }, err => {
                    console.log(err);
                });
            }
        });
    }

    ngOnDestroy() {
        this.commonService.backClicked = false;
        this.commonService.featuredArray = this.featuredData ? this.featuredData.length : 0;
        this.featuredDataSubscription.unsubscribe();
        const meta = this.generateEventsForFeaturedBanner('Homepage');
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_CLOSED, meta, Constants.SCREEN_ID.homescreen);
    }

    pageLoadEvent() {
        const meta = this.generateEventsForFeaturedBanner('Homepage');
        this.commonService.previousPageUrl ? meta['Previous_URL'] = this.commonService.previousPageUrl : '';
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_OPENED, meta, Constants.SCREEN_ID.homescreen);
    }

    featuredPageData(response) {
        if (!response.items) {
            return;
        }
        const index = response.items.findIndex(e => e.parentPackageType === Constants.BANNER_PACKAGE_KEY);
        this.tempData = response.items.slice(0);
        const temData = this.tempData.splice(index, 1);
        this.featuredData = this.tempData.slice(this.intialInx, this.lastInx);
        this.featuredRail = temData;
    }

    setMetaTags(playlist) {
        this.metaService.addValueInMetaArray('title', 'Listen & Download Latest MP3 Hindi, English, Bollywood Songs Online | Wynk Music', this.metaTags);
        this.metaService.addValueInMetaArray('description', 'Wynk Music - Download & Listen mp3 songs, music online for free. Enjoy from over 30 Lakh Hindi, English, Bollywood, Regional, Latest, Old songs and more. Create and Listen to your playlist, like and share your favorite music on the Wynk Music app.', this.metaTags);
        this.metaService.addValueInMetaArray('keywords', 'Download songs, music, mp3 songs online, listen songs, MP3 songs, free online songs, wynk music, online latest songs, free music, popular songs, movie songs, listen to songs online, listen to free music, online music, free music online, latest movie songs, hindi songs, music albums, free music, online music, english songs, hollywood songs, playlists music, music online, hindi songs, play songs, online songs', this.metaTags);
        this.metaService.addValueInMetaArray('og:title', 'Listen & Download Latest MP3 Hindi, English, Bollywood Songs Online | Wynk Music', this.metaTags);
        this.metaService.addValueInMetaArray('og:description', 'Wynk Music - Download & Listen mp3 songs, music online for free. Enjoy from over 30 Lakh Hindi, English, Bollywood, Regional, Latest, Old songs and more. Create and Listen to your playlist, like and share your favorite music on the Wynk Music app.', this.metaTags);
        this.metaService.addValueInMetaArray('og:url', 'https://wynk.in' + this.router.url.split('?')[0].replace('.html', ''), this.metaTags);
        this.metaService.addValueInMetaArray('og:image', 'https://wynk.in/assets/icons/icon-192x192.png', this.metaTags);
        this.metaService.addValueInMetaArray('robots', '', this.metaTags);
        this.metaService.setMetaTags(this.metaTags);
        this.metaService.createLinkForCanonicalURL();
        this.metaService.addGoogleStructuredDataScript(this.metaTags, this._renderer2, 'HOME');
    }
    generateEventsForFeaturedBanner(id: any) {
        const meta: any = {};
        id != '' ? meta.id = id : '';
        return meta;
    }

    trackByFn(index, items) {
        return items.id;
    }

    homeLazyLoadRails() {
        if (this.featuredData && this.featuredData.length != this.tempData.length) {
             this.intialInx = this.lastInx;
             this.lastInx += 1;
             this.featuredData.push(...this.tempData.slice(this.intialInx, this.lastInx));
        }
    }

    sharePlayList(songinfo) {
        this.modalPopupService.shareTo(songinfo, 'HOME');
    }

    updatePlaylist(action, songinfo) {
        this.modalPopupService.newPlaylist(songinfo, 'HOME');
    }

    railClickEvent(itemInfo, index, seeAllClicked) {
        const meta = this.generateEventsForFeaturedBanner('');
        meta['row_number'] = index + 1;
        meta['rail_title'] = itemInfo.title;
        meta['module_id'] = itemInfo.id;
        seeAllClicked ? meta['col_num'] = 'All' : '';

        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.homescreen);
    }

    railScroll(data, index) {
        clearTimeout(this.isRailScrolling);
        this.isRailScrolling = setTimeout(() => {
            const meta = this.generateEventsForFeaturedBanner('');
            meta['row_number'] = index;
            meta['rail_title'] = data.title;
            meta['module_id'] = data.id;
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.RAIL_SCROLL, meta, Constants.SCREEN_ID.homescreen);
        }, 500);
    }

    sendRailViewedEvent(index) {
        if (!this._localStorageWrapperService.isPlatformServer()) {
            const meta = this.generateEventsForFeaturedBanner('');
            meta['row_number'] = index;
            meta['rail_title'] = this.tempData[index - 1].title;
            meta['module_id'] = this.tempData[index - 1].id;
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.RAIL_VIEWED, meta, Constants.SCREEN_ID.homescreen);
        }
    }

    loadNextRail() {
        this.sendRailViewedEvent(this.lastInx);
        this.homeLazyLoadRails();
    }

}
