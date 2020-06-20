import { TestBed, ComponentFixture } from "@angular/core/testing"
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/services/common.service";
import { AppUtil } from "../../utils/AppUtil";
import { Analytics } from "../../analytics/analytics";
import { DownloadPopupComponent } from "./download-popup.component";
import { CookieService } from "ngx-cookie-service";
import { TitleCasePipe, CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe('DownloadPopupComponent', () => {

    let fixture: ComponentFixture<DownloadPopupComponent>;
    let component: DownloadPopupComponent;
    let commonService;
    let analyticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule,
                HttpClientModule
            ],
            declarations: [ DownloadPopupComponent ],
            providers: [
                NgbActiveModal,
                CommonService,
                AppUtil,
                Analytics,
                CookieService,
                TitleCasePipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DownloadPopupComponent);
        component = fixture.componentInstance;
        commonService = TestBed.get(CommonService);
        analyticsService = TestBed.get(Analytics);
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should show Android/iOS install links for desktop', () => {
        component.isMobileView = true;
        component.type = 'PACKAGE';
        fixture.detectChanges();
        let androidImg = fixture.debugElement.nativeElement.querySelector('img[title="Google App"]');
        let iosImg = fixture.debugElement.nativeElement.querySelector('img[title="IOS App"');
        expect(androidImg).not.toBeNull();
        expect(iosImg).not.toBeNull();
    });

    it('should navigate to Android link for desktop', () => {
        spyOn(component, 'navigateToApp').and.callThrough();
        spyOn(analyticsService, 'createAnalyticsEvent').and.callThrough();
        component.isMobileView = true;
        component.type = 'PACKAGE';
        fixture.detectChanges();
        let androidImg: HTMLElement = fixture.debugElement.nativeElement.querySelector('img[title="Google App"]');
        androidImg.click();
        expect(component.navigateToApp).toHaveBeenCalledWith(true);
        expect(analyticsService.createAnalyticsEvent).toHaveBeenCalledWith('click', {id: 'Android_Install'}, 'DOWNLOAD_POPUP');
    });

    it('should navigate to IOS link for desktop', () => {
        spyOn(component, 'navigateToApp').and.callThrough();
        spyOn(analyticsService, 'createAnalyticsEvent').and.callThrough();
        component.isMobileView = true;
        component.type = 'PACKAGE';
        fixture.detectChanges();
        let iosImg: HTMLElement = fixture.debugElement.nativeElement.querySelector('img[title="IOS App"');
        iosImg.click();
        expect(component.navigateToApp).toHaveBeenCalledWith(false);
        expect(analyticsService.createAnalyticsEvent).toHaveBeenCalledWith('click', {id: 'iOS_Install'}, 'DOWNLOAD_POPUP');
    });

    it('should show install now button for mobile', () => {
        spyOn(commonService, 'modifyMobileView').and.returnValue(true);
        component.type = 'PACKAGE';
        fixture.detectChanges();
        let button: HTMLElement = fixture.debugElement.nativeElement.querySelector('.install-button > button');
        expect(button.textContent).toEqual('Install Now');
    });

    it('should call openStoreUsingAppsflyer on clicking Install Now', () => {
        spyOn(commonService, 'modifyMobileView').and.returnValue(true);
        spyOn(component, 'openStoreUsingAppsflyer').and.callThrough();
        spyOn(analyticsService, 'createAnalyticsEvent').and.callFake(() => undefined);
        spyOn(component, 'redirectToUrl').and.callFake(() => undefined);
        component.type = 'PACKAGE';
        component.url = 'https://wynk.in';
        fixture.detectChanges();
        let button: HTMLElement = fixture.debugElement.nativeElement.querySelector('.install-button > button');
        button.click();
        expect(button.textContent).toEqual('Install Now');
        expect(component.openStoreUsingAppsflyer).toHaveBeenCalled();
        expect(analyticsService.createAnalyticsEvent).toHaveBeenCalledWith('click', {id: 'Install'}, 'DOWNLOAD_POPUP');
        expect(component.redirectToUrl).toHaveBeenCalledWith(component.url);
    });

    it('should show correct heading for download popup', () => {
        let p: HTMLElement;
        component.type = 'PACKAGE';
        component.viewType = 'download';
        fixture.detectChanges();
        p = fixture.debugElement.nativeElement.querySelector('p');
        expect(p.textContent).toEqual('To download this playlist & for the best music experience, install Wynk Music app');
    });

    it('should show correct heading for follow popup', () => {
        component.type = 'ARTIST';
        component.viewType = 'follow';
        fixture.detectChanges();
        let p: HTMLElement = fixture.debugElement.nativeElement.querySelector('p');
        expect(p.textContent).toEqual('To follow this artist’s top songs & stay updated, install Wynk Music app');
    });

    it('should show correct heading for hellotune popup', () => {
        component.type = 'hellotunes';
        component.viewType = 'hellotune';
        fixture.detectChanges();
        let p: HTMLElement = fixture.debugElement.nativeElement.querySelector('p');
        expect(p.textContent).toEqual('To set this song as hellotune for your Airtel number, install Wynk Music app');
    });
})