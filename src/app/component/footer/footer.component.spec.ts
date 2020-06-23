import { TestBed, ComponentFixture } from "@angular/core/testing";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { FoterComponent } from "./footer.component";
import { CommonService } from "../../shared/services/common.service";
import { CookieService } from "ngx-cookie-service";
import { ToastrService, ToastrModule, ToastNoAnimationModule } from "ngx-toastr";
import { ToastrComponent } from "../toastr/toastr.component";
import { GoogleAnalyticsService } from "../../analytics/google-analytics.service";
import { AppUtil } from "../../utils/AppUtil";
import { LocalStorageWrapperService } from "../../shared/services/localstorage-wrapper.service";
import { HttpRequestManager } from "../../http-manager/http-manager.service";
import { PersistDataService } from "../../shared/services/persistData.service";
import { PipeModule } from "../../pipes/pipe.module";
import { footerDataMock } from "../../../../mocks/footerData.mock";
import { Observable, of } from "rxjs";
import { environment } from '../../../environments/environment';
import { Constants } from '../../constant/constants';


describe('FooterComponent', () => {

    let fixture: ComponentFixture<FoterComponent>;
    let component: FoterComponent;
    let element: HTMLElement;
    let localStorageService;
    let httpService;
    let commonService;
    const FOOTER_DATA_URL = '/assets/json/footerData.json';
    let modifyMobileViewSpy;
    let googleAnalyticsService;
    let appUtil;
    let persistDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule,
                HttpClientModule,
                ToastrModule.forRoot({
                    toastComponent: ToastrComponent,
                    positionClass: 'toast-bottom-center',
                    toastClass: 'toast',
                    timeOut: 4000
                }),
                ToastNoAnimationModule,
                PipeModule
            ],
            declarations: [ FoterComponent ],
            providers: [
                AppUtil,
                CommonService,
                GoogleAnalyticsService,
                LocalStorageWrapperService,
                HttpRequestManager,
                PersistDataService,
                CookieService,
                TitleCasePipe,
                ToastrService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FoterComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
        localStorageService = TestBed.get(LocalStorageWrapperService);
        commonService = TestBed.get(CommonService);
        httpService = TestBed.get(HttpRequestManager);
        googleAnalyticsService = TestBed.get(GoogleAnalyticsService);
        appUtil = TestBed.get(AppUtil);
        persistDataService = TestBed.get(PersistDataService);
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should call getFooterData and setFooterData with footer data in Window', () => {
        const footerData = new footerDataMock().getFooterData();
        (<any>window)._FOOTERDATA = footerData;
        const getFooterDataSpy = spyOn(component, "getFooterData").and.callThrough();
        const setFooterDataSpy = spyOn(component, "setFooterData").and.callThrough();
        const localstorageSpy = spyOn(localStorageService, "setItem");
        component.ngOnInit();
        fixture.detectChanges();
        expect(getFooterDataSpy).toHaveBeenCalled();
        expect(setFooterDataSpy).toHaveBeenCalledWith(footerData);
        expect(localstorageSpy).toHaveBeenCalled();
    });

    it('should call getFooterData and setFooterData with footer API call', () => {
        const footerData = new footerDataMock().getFooterData();
        (<any>window)._FOOTERDATA = null;
        spyOn(httpService, "getWithoutHeader").and.returnValue(new Observable(subscriber => {
            subscriber.next(footerData);
            subscriber.complete();
        }));
        const getFooterDataSpy = spyOn(component, "getFooterData").and.callThrough();
        const setFooterDataSpy = spyOn(component, "setFooterData").and.callThrough();
        component.ngOnInit();
        fixture.detectChanges();
        expect(getFooterDataSpy).toHaveBeenCalled();
        fixture.whenStable().then(() => {
            expect(setFooterDataSpy).toHaveBeenCalled();
        })
    })

    it('Footer data URL in SSR', () => {
        spyOn(localStorageService, "isPlatformServer").and.returnValue(true);
        fixture = TestBed.createComponent(FoterComponent);
        component = fixture.componentInstance;
        expect(component.FOOTER_DATA_URL).toEqual(environment.SSR_URL + FOOTER_DATA_URL)
    })

    it('Player should be undefined in SSR', () => {
        spyOn(localStorageService, "isPlatformServer").and.returnValue(true);
        fixture = TestBed.createComponent(FoterComponent);
        component = fixture.componentInstance;
        let player = component.checkPlayerVisibility([]);
        expect(player).toBeUndefined();
    })    

    it('Player should be visible if Queue is not empty', (done) => {
        component.checkPlayerVisibility([{title: 'Treasure'}]);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let showPlayerBottom = document.body.classList.contains('showPlayeratBottom');
            expect(showPlayerBottom).toBeTruthy();
            done();
        })
    })

    it('hideFooterOnMobile as per window width', () => {
        spyOn(commonService, "modifyMobileView").and.returnValue(true);
        Constants.WINDOW_INNER_WIDTH_FOR_MOBILE = 10000;
        component.hideFooterOnMobile();
        expect(component.latestSong).toBeFalsy();
        expect(component.genre).toBeFalsy();
        expect(component.oldSong).toBeFalsy();
        expect(component.album).toBeFalsy();
        expect(component.topArtist).toBeFalsy();
        expect(component.topLang).toBeFalsy();
        expect(component.topSongs).toBeFalsy();
        expect(component.topLyrics).toBeFalsy();
    })

    it('Footer titles should be correct', () => {
        spyOn(commonService, "modifyMobileView").and.returnValue(true);
        const footerData = new footerDataMock().getFooterData();
        (<any>window)._FOOTERDATA = footerData;
        component.language = 'Hindi';
        fixture.detectChanges();
        let titleNodes = Array.from(element.querySelectorAll('.fHeading'));
        let titleNodeValues = ['Top Hindi Albums', 'Genres', 'OLD SONGS', 'Top Languages', 'Top Artists', 'Latest Hindi Songs', 'Top Songs', 'Top Searched Hindi Lyrics']
        expect(titleNodes.length).toEqual(8);
        expect(titleNodes[0].textContent.trim()).toEqual(titleNodeValues[0]);
        expect(titleNodes[1].textContent.trim()).toEqual(titleNodeValues[1]);
        expect(titleNodes[2].textContent.trim()).toEqual(titleNodeValues[2]);
        expect(titleNodes[3].textContent.trim()).toEqual(titleNodeValues[3]);
        expect(titleNodes[4].textContent.trim()).toEqual(titleNodeValues[4]);
        expect(titleNodes[5].textContent.trim()).toEqual(titleNodeValues[5]);
        expect(titleNodes[6].textContent.trim()).toEqual(titleNodeValues[6]);
        expect(titleNodes[7].textContent.trim()).toEqual(titleNodeValues[7]);
    })

    it('toggleFooter should be called on clicking footer titles on mobile', () => {
        spyOn(commonService, "modifyMobileView").and.returnValue(true);
        const footerData = new footerDataMock().getFooterData();
        (<any>window)._FOOTERDATA = footerData;
        const toggleFooterSpy = spyOn(component, "toggleFooter").and.callThrough();
        component.language = 'Hindi';
        fixture.detectChanges();
        let titleNodes = Array.from(element.querySelectorAll('.fHeading'));
        titleNodes.forEach((node) => {
            (<HTMLElement>node).click();
        });
        expect(toggleFooterSpy).toHaveBeenCalledTimes(8);
    })

    it('openPwaPopUp should be called on install PWA', () => {
        (<any>window).ga = () => {};
        spyOn(commonService, "modifyMobileView").and.returnValue(false);
        fixture.detectChanges();
        component.isPwaPushShow = true;
        fixture.detectChanges();
        let openPwaPromptSpy = spyOn(commonService, "openPwaPrompt").and.callThrough();
        let sendPwaAnalyticEventSpy = spyOn(commonService, "sendPwaAnalyticEvent").and.callFake(() => {});
        let elem = element.querySelector('button[aria-label="install PWA"]');
        (<HTMLElement>elem).click();
        expect(openPwaPromptSpy).toHaveBeenCalled();
        expect(sendPwaAnalyticEventSpy).toHaveBeenCalledWith('Install_Desktop_Widget');
    })

    it('openStoreUsingAppsflyer should be called on Get App', () => {
        (<any>window).ga = () => {};
        spyOn(commonService, "modifyMobileView").and.returnValue(true);
        component.isPwaPushShow = false;
        let openStoreUsingAppsflyerSpy = spyOn(component, "openStoreUsingAppsflyer").and.callThrough();
        spyOn(googleAnalyticsService, "sendEvents").and.callFake((eventLabel, eventCategory, eventAction)=>{
            expect(eventLabel).toEqual("Install");
            expect(eventCategory).toEqual("FOOTER");
            expect(eventAction).toEqual("click");
        });
        let windowOpenSpy = spyOn(window, "open").and.callFake(() => {});
        let sendPageEventsSpy = spyOn(component, "sendPageEvents").and.callThrough();
        let generateAppsFlyerUrlSpy = spyOn(commonService, "generateAppsFlyerUrl").and.returnValue('https://wynk.in');
        fixture.detectChanges();
        let elem = element.querySelector('.f-lhs-button');
        (<HTMLElement>elem).click();
        expect(openStoreUsingAppsflyerSpy).toHaveBeenCalledWith('footer_bottom');
        expect(sendPageEventsSpy).toHaveBeenCalledWith("Install", "FOOTER", "click");
        expect(generateAppsFlyerUrlSpy).toHaveBeenCalled();
        expect(windowOpenSpy).toHaveBeenCalledWith('https://wynk.in', "_blank");
    })

    it('navigateToApp should be called with android', () => {
        (<any>window).ga = () => {};
        let navigateToAppSpy = spyOn(component, "navigateToApp").and.callThrough();
        spyOn(googleAnalyticsService, "sendEvents").and.callFake((eventLabel, eventCategory, eventAction)=>{
            expect(eventLabel).toEqual("Android_Install");
            expect(eventCategory).toEqual("FOOTER");
            expect(eventAction).toEqual("click");
        });
        let appUtilSpy = spyOn(appUtil, "getAppUrl").and.returnValue('https://wynk.in');
        let windowOpenSpy = spyOn(window, "open").and.callFake(() => {});
        fixture.detectChanges();
        let elems = element.querySelectorAll('.appStore img');
        (<HTMLElement>elems[0]).click();
        expect(navigateToAppSpy).toHaveBeenCalledWith(true);
        expect(appUtilSpy).toHaveBeenCalledWith(true);
        expect(windowOpenSpy).toHaveBeenCalledWith('https://wynk.in', "_blank");
    })

    it('navigateToApp should be called with android', () => {
        (<any>window).ga = () => {};
        let navigateToAppSpy = spyOn(component, "navigateToApp").and.callThrough();
        spyOn(googleAnalyticsService, "sendEvents").and.callFake((eventLabel, eventCategory, eventAction)=>{
            expect(eventLabel).toEqual("iOS_Install");
            expect(eventCategory).toEqual("FOOTER");
            expect(eventAction).toEqual("click");
        });
        let appUtilSpy = spyOn(appUtil, "getAppUrl").and.returnValue('https://wynk.in');
        let windowOpenSpy = spyOn(window, "open").and.callFake(() => {});
        fixture.detectChanges();
        let elems = element.querySelectorAll('.appStore img');
        (<HTMLElement>elems[1]).click();
        expect(navigateToAppSpy).toHaveBeenCalledWith(false);
        expect(appUtilSpy).toHaveBeenCalledWith(false);
        expect(windowOpenSpy).toHaveBeenCalledWith('https://wynk.in', "_blank");
    })
})