import { IconThemePipe } from './../../pipes/iconThemePipe/iconThemePipe';
/**
* Created by Harish Chandra.
*/
import { Component } from '@angular/core';
import { AppUtil } from '../../utils/AppUtil';
import { CommonService } from '../../shared/services/common.service';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
import { HomeService } from '../../modules/home/service/home.component.service';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constant/constants';
import { Router } from '../../../../node_modules/@angular/router';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { HttpRequestManager } from '../../http-manager/http-manager.service';
import { PersistDataService } from '../../shared/services/persistData.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss'],
    providers: [GoogleAnalyticsService, HomeService]
})
export class FoterComponent {
    public footerData: Object;
    public FOOTER_DATA_URL = '/assets/json/footerData.json';
    public topArtist: boolean = true;
    public genre: boolean = true;
    public topLang: boolean = true;
    public topSongs: boolean = true;
    public topLyrics: boolean = true;
    public oldSong: boolean = true;
    public album: boolean = true;
    public latestSong: boolean = true;
    public modifyMobileView: boolean = false;
    
    public latestTopSongs: any = null;
    public topSearchedLyrics: any = null;    
    public topArtistList: any = null;
    public topLanguageList: any = null;
    public genres: any = null;
    public isPwaPushShow = false;
    public language = "";
    public oldsongs: any = null;
    public albumsByLang: any = null;
    public lyricsByLang: any = null;
    public latestSongsByLang: any = null;
    public albums: any = null;
    public latestSongs: any =null;
    public _FOOTERDATA: any = null;
    private theme: string;
    public themeSubscription: Subscription;

    constructor(
        private appUtil: AppUtil,
        private commonService: CommonService,
        private googleAnalytics: GoogleAnalyticsService,
        public _router: Router,
        private _localStorageWrapperService: LocalStorageWrapperService,
        private httpService: HttpRequestManager,
        private persistDataService: PersistDataService
    ) {
        this.themeSubscription = this.commonService.theme$.subscribe((res)=>{
            this.theme = res;
        })  
        if(this._localStorageWrapperService.isPlatformServer())
            this.FOOTER_DATA_URL = environment.SSR_URL + this.FOOTER_DATA_URL;
    }

    ngOnInit() {

        this.persistDataService.contentLang$.subscribe( res => {
            this.language = res;
        });
        this.getFooterData();
        this.hideFooterOnMobile();
        this.modifyMobileView = this.commonService.modifyMobileView();
        this.persistDataService.isPwaPushShow$.subscribe(res => {
            this.isPwaPushShow = res && !this.modifyMobileView;
        })

        this.persistDataService.totalQueuedSongs$.subscribe(res=>{
            this.checkPlayerVisibility(res);
        }) 
    }

    checkPlayerVisibility(queueData) { 
        if(this._localStorageWrapperService.isPlatformServer()) return;
        if ( queueData && queueData.length > 0 ) {
            document.getElementById('footer').classList.add('footer-mb');
            document.body.classList.add('showPlayeratBottom');
        } else {
            document.getElementById('footer').classList.remove('footer-mb');
        }
    }

    hideFooterOnMobile() {
        if(!this._localStorageWrapperService.isPlatformServer()){
            if (window.innerWidth < Constants.WINDOW_INNER_WIDTH_FOR_MOBILE) {
                this.latestSong = false;
                this.genre = false;
                this.oldSong = false;
                this.album = false;
                this.topArtist = false;
                this.topLang = false;
                this.topSongs = false;
                this.topLyrics = false;
            }
        }
    }

    sendPageEvents(eventLabel, eventCategory, eventAction) {
        this.googleAnalytics.sendEvents(eventLabel, eventCategory, eventAction);
    }

    navigateToApp(isAndroid) {
        if(this._localStorageWrapperService.isPlatformServer) return;
        if (!isAndroid) {
            this.sendPageEvents("iOS_Install", "FOOTER", "click");
        } else {
            this.sendPageEvents("Android_Install", "FOOTER", "click");
        }
        let url = this.appUtil.getAppUrl(isAndroid);
        window.open(url, "_blank");
    }

    openStoreUsingAppsflyer(origin) {
        if(this._localStorageWrapperService.isPlatformServer) return;

        if(!this._localStorageWrapperService.isPlatformServer()){
            this.sendPageEvents("Install", "FOOTER", "click");
            let url = this.commonService.generateAppsFlyerUrl({}, origin, '', 'Footer', '');
            window.open(url, "_blank");
        }
    }

    openPwaPopUp(origin) {
        this.commonService.openPwaPrompt();
        this.commonService.sendPwaAnalyticEvent(origin);
    }

    setFooterData(res){
        
        this.topSearchedLyrics = res['topSearchedLyrics'];
        this.latestTopSongs = res[Constants.WYNK_TOP_100_KEY];
        this.topArtistList = res['top_artists'];
        this.topLanguageList = res['languages'];
        this.genres = res['genres']     
        this.oldsongs = res['Old Songs'];
        this.albumsByLang = res['albumsByLang'];
        this.lyricsByLang = res['lyricsByLang'];
        this.latestSongsByLang = res['latestSongsByLang'];
        this.albums = res["topAlbums"];
        this.latestSongs = res['latestSongsByLang']['latestSongs'];
        this.footerData = {
            songs:this.latestTopSongs,
            language:this.topLanguageList,
            artist:this.topArtistList,
            lyrics:this.topSearchedLyrics,
            albums:this.albums,
            genres:this.genres,
            oldSongs:this.oldsongs,
            albumsByLang:this.albumsByLang,
            lyricsByLang:this.lyricsByLang,
            latestSongsByLang:this.latestSongsByLang,
            latestSongs: this.latestSongs
        };      
        
        this._localStorageWrapperService.setItem('footerData', JSON.stringify(this.footerData));
    }
    

    getFooterData() {
        if(this._localStorageWrapperService.isPlatformServer()) return;
        if((<any>window)._FOOTERDATA){
            this.setFooterData((<any>window)._FOOTERDATA)
        }else{
            this.httpService.getWithoutHeader(this.FOOTER_DATA_URL).subscribe(res=>{
            this.setFooterData(res);
        })
    }
    }


    toggleFooter(footerTitle) {
        if (this.modifyMobileView) {
            switch (footerTitle) {
                case 'topArtist': this.topArtist = !this.topArtist;
                break;
                case 'genre': this.genre = !this.genre;
                break;
                case 'oldSong': this.oldSong = !this.oldSong;
                break;
                case 'latestSong': this.latestSong = !this.latestSong;
                break;
                case 'album':this.album = !this.album;
                break;
                case 'topLang': this.topLang = !this.topLang;
                break;
                case 'topSongs': this.topSongs = !this.topSongs;
                break;
                case 'topLyrics': this.topLyrics =!this.topLyrics;
                break;
            }
        }

    }
    ngOnDestroy(){
        if(this.themeSubscription){
            this.themeSubscription.unsubscribe()
        }
    }
}