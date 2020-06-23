 import { IconThemePipe } from './../../pipes/iconThemePipe/iconThemePipe'
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PersistDataService } from '../../shared/services/persistData.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/services/user.service'
import { CommonService } from '../../shared/services/common.service';
import { ModalPopupService } from '../../shared/services/modal-popup.service';
import { ToastrService } from 'ngx-toastr';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';
import { AppUtil } from '../../utils/AppUtil';
import { DynamicLoaderDirective } from '../../directives/dynamic-component-loader/dynamic-component-loader';
import { SearchService } from './service/search.service';
import { fromEvent, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { ImagePipe } from '../../pipes/imagePipe/image.pipe';
import { SoundQualityComponent } from '../sound-quality/sound-quality.component';
import { GoogleAnalyticsService } from '../../analytics/google-analytics.service';
import { TfaService } from '../../shared/services/tfa.service';



@Component({
    selector: 'app-top-nav',
    templateUrl: 'top-nav.component.html',
    styleUrls: ['top-nav.component.scss'],
    providers: [SearchService]
})
export class TopNavComponent implements OnInit {
    @Input('config') config;
    @Output() languageChangedAgain = new EventEmitter();
    @ViewChild(DynamicLoaderDirective, {static:false}) searchHost: DynamicLoaderDirective;
    @ViewChild('inputSearchText', {static:false}) inputSearchText;

    isCollapsedMyMusic:boolean;
    isCollapsedDownloadApp:boolean;
    public languagePopUpModal;
    public soundQualityPopup;
    isLoggedIn = false;
    loggedInUserData = { 'msisdn': '', 'message': '' };
    searchComponentRef: any;
    isShowAppSearch = false;
    searchResult = [];
    searchValue: any;
    searchTitle: any;
    songFilter: any;
    public profileImage: string;
    public searchinput: string;
    public searchData: any = [];
    public noSearchResult: null;
    public inputFilledObs: any;
    public searchCloseIcon: boolean = false;
    public isMobileViewForHeader: boolean = false;
    public hamburgerToggle: boolean = false;
    public theme: string = 'dark'
    profileIcon: string;
    public themeSubscription: Subscription;

    constructor(
        private persistDataService: PersistDataService,
        private modalService: NgbModal,
        public UserService: UserService,
        public commonService: CommonService,
        private modalPopUpService: ModalPopupService,
        private toasterService: ToastrService,
        private analytics: Analytics,
        private appUtil: AppUtil,
        private searchService: SearchService,
        private _router: Router,
        private _localStorageWrapperService: LocalStorageWrapperService,
        private googleAnalytics: GoogleAnalyticsService,
        private tfaService: TfaService,
    ) {
        this.isCollapsedDownloadApp = true;
        this.isCollapsedMyMusic = true;
         this.themeSubscription = this.commonService.theme$.subscribe((res)=>{
            this.theme = res;
        })
        persistDataService.isUserLogin$.subscribe(res => {
            this.config = JSON.parse(this._localStorageWrapperService.getItem('config')) || this.commonService.getUserDetailsObj();
            if (this.config) {
                this.isLoggedIn = res;
                let userMsisdn = this.commonService.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser();
                this.loggedInUserData.msisdn = userMsisdn && userMsisdn.msisdn ? userMsisdn.msisdn : '';
                this.updateProfile();
                this.loggedInUserData.message = this.config.subscription && this.config.subscription.headerMessage ? this.config.subscription.headerMessage : '';
            }
        })
    }
    ngOnInit() {
        let loggedInUser = this.commonService.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser();
        let item = this._localStorageWrapperService.getItem('searchData');
        this.isMobileViewForHeader = this.commonService.modifyMobileView();
        if (item) {
            this.searchData = JSON.parse(item);
        }
        if (loggedInUser) {
            this.isLoggedIn = true;
            this.config = JSON.parse(this._localStorageWrapperService.getItem('config'));
            this.updateProfile();
            this.loggedInUserData.msisdn = loggedInUser.msisdn;
            this.loggedInUserData.message = this.config.subscription.headerMessage;
        } else {
            this.isLoggedIn = false
        }
    }

    toggleTheme(){
        let meta = this.generateEventsForTopNav("theme");
        if(this.theme === "dark") meta['dark-theme'] = "light";
        else meta['dark-theme'] = "dark";
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, this.commonService.getScreenId());
        this.commonService.toggleTheme();
        this.updateProfile();
    }

    updateProfile(){
        this.profileIcon = new IconThemePipe().transform("userProfileIcon",this.theme);
        this.profileImage = this.config.profile && this.config.profile.avatar ? new ImagePipe(this.commonService).transform(this.config.profile.avatar, 'SONG-SM') : this.profileIcon;
    }

    
    toggleMenu(isCollapsed,downloadApp) {
        if(downloadApp){
            this.isCollapsedDownloadApp = isCollapsed;
        }
        else{
            this.isCollapsedMyMusic = isCollapsed;
        }
       
    }
    openNav() {
        this.UserService.openSideBar();
    }

    openModal() {
        this.modalPopUpService.openLoginModal("Sign_In_Header");
    }

    languageChangeEvent(value) {
        this.languageChangedAgain.emit({ value: value, ref: this.languagePopUpModal });
    }
    languageModal(modalRef) {
        this.languagePopUpModal = this.modalService.open(modalRef, { centered: true, windowClass: "popup-language" });
    }
    closeLangugaePopUp() {
        this.languagePopUpModal.close();
    }

    soundQualityModal(modalRef){
        this.soundQualityPopup = this.modalService.open(modalRef, { centered: true, windowClass: "popup-language" });
    }

    closeSoundQualityPopUp() {
        this.soundQualityPopup.close();
    }

    signOut() {
        this.isLoggedIn = false;
        this.commonService.removeCookieForLoggedInUser("");
        this.persistDataService.setUserLoggedIn(false);
        const user = this.commonService.getCookieForNonLoggedInUser();
        this.commonService.saveRequiredParams(
            user.dt,
            user.kt,
            Date.now()
        );
        this.tfaService.updateTek();
        
        this.toasterService.show(Constants.TOAST_MESSAGE.LOGOUT);
        this.persistDataService.isFeaturedDataUpdated(false);
        this.persistDataService.setRplList([]);
        let meta = this.generateEventsForTopNav("Sign_Out");
        meta['msisdn'] = this.loggedInUserData.msisdn;
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SIGNOUT, meta, Constants.SCREEN_ID.REGISTER);
    }
    navigateToApp(isAndroid) {
        let meta;
        if (!isAndroid) {
            meta = this.generateEventsForTopNav("App_Install_Header_Ios");

        } else {
            meta = this.generateEventsForTopNav("App_Install_Header_Android");
        }
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.REGISTER);
        let url = this.appUtil.getAppUrl(isAndroid);
        //window.location.href = url;
        window.open(url, '_blank');
    }

    generateEventsForTopNav(id) {
        let meta: any = {};
        id != null ? meta.id = id : '';
        return meta;
    }
    openSearchComponent(value) {
        this.isShowAppSearch = true;
        this.searchCloseIcon = true;
        if (this._localStorageWrapperService.getItem('searchData') || value.length > 0) {
            this.getAutosuggestData(value);
        }
        else {
            this.getTrendingSearchData();
        }
        let input$ = fromEvent(this.inputSearchText.nativeElement, 'input').pipe(map((x: any) => x.currentTarget.value)
            , debounceTime(300))
        this.inputFilledObs = input$.subscribe(x => this.getAutosuggestData(x));

        //Analitics
        let meta = this.generateEventsForTopNav("Search_Click");
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.SEARCH);

        let meta1 = this.generateEventsForTopNav("Search");
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_OPENED, meta1, Constants.SCREEN_ID.SEARCH);
    }

    closeSearchComponent() {
        this.inputFilledObs.unsubscribe();
        setTimeout(() => {
            this.isShowAppSearch = false;
            this.searchCloseIcon = false;
            let meta = this.generateEventsForTopNav("Search");
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_CLOSED, meta, Constants.SCREEN_ID.SEARCH);

        }, 300)
    }

    getTrendingSearchData() {
        let selectedLanguage = this.commonService.getSelectedLanguages();
        this.searchService.getAutoTrendingResult(selectedLanguage).subscribe(res => {
            this.searchResult = res.items;
            this.songFilter = 'trendingSearch';
            this.searchTitle = 'Trending Searches';

            let meta = this.generateEventsForTopNav("Search");
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.TRENDING_SEARCHES_SHOWN, meta, Constants.SCREEN_ID.SEARCH);

        })
    }

    getAutosuggestData(value) {
        this.isShowAppSearch = true;

        if (value.length > 2 && value.length < 60) {
            if(value.trim()){
            this.searchService.getAutoSuggestResult(value).subscribe(res => {
                this.searchValue = value;
                this.searchResult = res.data;
                if (this.searchResult.length > 0) {
                    this.songFilter = 'autoSuggest';
                    this.searchTitle = 'Suggestions';
                    this.noSearchResult = null;
                } else {
                    this.songFilter = '';
                    this.searchTitle = "Search " + value;
                    this.noSearchResult = value;
                }

                let meta = this.generateEventsForTopNav("Search");
                meta['keyword'] = value;
                this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.AUTO_SUGGEST_SHOWN, meta, Constants.SCREEN_ID.SEARCH);

            })
        }
        }
        else if (value.length <= 2) {
            this.searchResult = [];
            this.noSearchResult = null;

            if (this._localStorageWrapperService.getItem('searchData')) {
                this.searchTitle = 'Recent Searches';
                this.songFilter = 'recentSearch';

            } else if (value.length == 0) {
                this.searchTitle = 'Trending Searches';
                this.getTrendingSearchData();
                this.songFilter = 'trendingSearch';
            }
            else {
                this.searchTitle = '';

            }
        }
        else {
            this.toasterService.warning(Constants.TOAST_MESSAGE.INVALID_SEARCH);
        }

    }
    navigateToSearchDetails(value) {
        value = value.trim();
        if (value) {
            this.searchValue = value;
            this.isShowAppSearch = false;
            this.commonService.setUnisearchAutoSuggestData(false);
            this._router.navigate(['/music/detailsearch/' + this.searchValue], { queryParams: { q: this.searchValue } });
            
            if (this.commonService.modifyMobileView()) { this.openSearchTextBox(false); }

            let itemSearchMeta = this.generateEventsForTopNav(null);
            itemSearchMeta['keyword'] = value;
            itemSearchMeta['source'] = 'Fresh Search';
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.ITEM_SEARCH, itemSearchMeta, Constants.SCREEN_ID.SEARCH);
        }
    }

    openSearchTextBox(value) {
        if(this.isMobileViewForHeader){
            var searchinputElement = <any>document.getElementById('searchMobWrap');
            if(!value) {searchinputElement.style.display = 'none';}
        }
        if (value) {
            searchinputElement.style.display = 'inline-block';
            this.searchCloseIcon = true;
            setTimeout(() => {
                this.inputSearchText.nativeElement.focus();
            }, 200)
        }
        else {
            this.searchCloseIcon = false;
            this.isShowAppSearch = false;
            this.inputSearchText.nativeElement.value = '';

            let meta = this.generateEventsForTopNav("Search");
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_CLOSED, meta, Constants.SCREEN_ID.SEARCH);
        }
    }

    searchKeywordValue(songInfo) {
        let searchinputElement = <any>document.getElementById('searchinput');

        this.commonService.setSearchResultSource(songInfo.filter);

        let itemSearchMeta = this.generateEventsForTopNav(null);

        if (songInfo.filter == 'trendingSearch') {
            searchinputElement.value = songInfo.songtitle;
            this.searchinput = songInfo.songtitle;
            if(!songInfo.noFetch) this.getAutosuggestData(this.searchinput);

            itemSearchMeta['keyword'] = this.searchinput;
            itemSearchMeta['source'] = songInfo.filter
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.ITEM_SEARCH, itemSearchMeta, Constants.SCREEN_ID.SEARCH);

        } else if (songInfo.filter == 'recentSearch') {
            searchinputElement.value = songInfo.songtitle.heading;
            this.searchinput = songInfo.songtitle.heading;
            if(!songInfo.noFetch) this.getAutosuggestData(this.searchinput);

            itemSearchMeta['keyword'] = this.searchinput;
            itemSearchMeta['source'] = songInfo.filter
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.ITEM_SEARCH, itemSearchMeta, Constants.SCREEN_ID.SEARCH);

        } else if (songInfo.filter == 'autoSuggest') {
            searchinputElement.value = songInfo.songtitle.asname;
            this.searchinput = songInfo.songtitle.asname;

            itemSearchMeta['keyword'] = this.searchinput;
            itemSearchMeta['source'] = songInfo.filter
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.ITEM_SEARCH, itemSearchMeta, Constants.SCREEN_ID.SEARCH);
        }

        if (this.commonService.modifyMobileView()) { this.openSearchTextBox(false); }
    }

    closeBlackScreen() {
        this.UserService.openSideBar();
    }

    navigateToSearchPage(ev) {
        if (this.commonService.modifyMobileView()) { this.openSearchTextBox(false); }
        this.commonService.setUnisearchAutoSuggestData(false);
        this._router.navigate(['/music/detailsearch/' + this.noSearchResult], { queryParams: { q: this.noSearchResult } });
    }

    closeQueue() {
        let ele: HTMLElement = document.getElementById("queueBlock");
        if (ele) {
            ele.classList.remove('mob-rhs-show');
        }
    }

    searchBoxInputValue() {
        this.searchinput = this.inputSearchText.nativeElement.value;
    }

    hamburgerNavbar(val) {
        this.hamburgerToggle = !this.hamburgerToggle;
        if (val) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }
    downloadApp(origin){
        if(!this._localStorageWrapperService.isPlatformServer()){
            let meta;
            meta = this.generateEventsForTopNav("App_Install_Hamburger");
            this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.REGISTER);
            let url = this.commonService.generateAppsFlyerUrl({}, origin, '', 'Navbar', '');
            window.open(url, "_blank");
        }
    }

    toggleSearchInMobile() {
        let el = document.getElementById('searchMobWrap');
        el.style.display = 'inline-block'
    }
    
    sendPageEvents(eventLabel, eventCategory, eventAction) {
        this.googleAnalytics.sendEvents(eventLabel, eventCategory, eventAction);
    }
    ngOnDestroy(){
        if(this.themeSubscription){
            this.themeSubscription.unsubscribe();
        }
    }
}
