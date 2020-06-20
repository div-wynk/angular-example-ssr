import { TestBed, ComponentFixture } from "@angular/core/testing";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { SocialShareComponent } from "./social-share.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/services/common.service";
import { Analytics } from "../../analytics/analytics";
import { CookieService } from "ngx-cookie-service";
import { ToastrService, ToastrModule, ToastNoAnimationModule } from "ngx-toastr";
import { SongMock, PlaylistMock, AlbumMock, PackageMock } from "../../../../mocks/index.mocks";
import { ToastrComponent } from "../toastr/toastr.component";


describe('SocialShareComponent', () => {

    let fixture: ComponentFixture<SocialShareComponent>;
    let component: SocialShareComponent;
    let element: HTMLElement;
    let analyticsService;
    let commonService;
    let toastrService;

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
                ToastNoAnimationModule
            ],
            declarations: [ SocialShareComponent ],
            providers: [
                NgbActiveModal,
                CommonService,
                Analytics,
                CookieService,
                TitleCasePipe,
                ToastrService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SocialShareComponent);
        component = fixture.componentInstance;
        component.screenID = 'SongInfo';
        element = fixture.debugElement.nativeElement;
        analyticsService = TestBed.get(Analytics);
        commonService = TestBed.get(CommonService);
        toastrService = TestBed.get(ToastrService);
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });

    it('should create song text', () => {
        let songMock = new SongMock();
        component.shareSongInfo = songMock.getSong();
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to " + component.shareSongInfo.title + " at " + encodeURI(component.shareSongInfo.shortUrl))
        expect(component.findModuleType()).toEqual("Song_Id");
    });

    it('should create album text', () => {
        let albumMock = new AlbumMock();
        component.shareSongInfo = albumMock.getMockAlbum();
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toEqual("Album_Id");
    });

    it('should create mood text', () => {
        let albumMock = new AlbumMock();
        component.shareSongInfo = albumMock.getMockAlbum();
        component.shareSongInfo.type = 'MOOD';
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " mood at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toBeNull();
    });

    it('should create genre text', () => {
        let albumMock = new AlbumMock();
        component.shareSongInfo = albumMock.getMockAlbum();
        component.shareSongInfo.type = 'GENRE';
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " genre at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toBeNull();
    });

    it('should create artist text', () => {
        let albumMock = new AlbumMock();
        component.shareSongInfo = albumMock.getMockAlbum();
        component.shareSongInfo.type = 'ARTIST';
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " artist at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toEqual("Artist_Id");
    });

    it('should create package text', () => {
        let packageMock = new PackageMock();
        component.shareSongInfo = packageMock.getPackage();
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toEqual("Package_Id");
    });

    it('should create playlist text', () => {
        let playlistMock = new PlaylistMock();
        component.shareSongInfo = playlistMock.getPlaylist();
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " playlist at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toEqual("Playlist_Id");
    });

    it('should create userplaylist text', () => {
        let playlistMock = new PlaylistMock();
        component.shareSongInfo = playlistMock.getPlaylist();
        component.shareSongInfo.type = 'USERPLAYLIST';
        fixture.detectChanges();
        expect(component.text).toEqual("Listen to songs of " + component.shareSongInfo.title + " at " + encodeURI(component.shareSongInfo.shortUrl));
        expect(component.findModuleType()).toBeNull();
    });

    it('should create no text', () => {
        let playlistMock = new PlaylistMock();
        component.shareSongInfo = playlistMock.getPlaylist();
        component.shareSongInfo.type = 'RECO';
        fixture.detectChanges();
        expect(component.text).toEqual("Groove with WynkMusic - the largest Indian & International music destination. Download unlimited music and listen to it offline!");
        expect(component.findModuleType()).toBeNull();
        let meta = component.generateEventsForShare("Share_WhatsApp", component.findModuleType());
        expect(meta.id).toEqual("Share_WhatsApp");
    });

    it('should return null for fn generateEventsForShare', () => {
        let playlistMock = new PlaylistMock();
        component.shareSongInfo = playlistMock.getPlaylist();
        component.shareSongInfo.type = 'RECO';
        fixture.detectChanges();
        let meta = component.generateEventsForShare("Share_WhatsApp", component.findModuleType());
        expect(meta.id).toEqual("Share_WhatsApp");
        expect(meta.type).toEqual('RECO');
    });
    
    it('should share on facebook', () => {
        spyOn(component, 'facebook').and.callThrough();
        spyOn(component, 'generateEventsForShare').and.callThrough();
        spyOn(analyticsService, 'createAnalyticsEvent').and.callFake(() => undefined);
        component.shareSongInfo = new SongMock().getSong();
        fixture.detectChanges();
        let btn: HTMLElement = element.querySelector('.soc-facebook');
        btn.click();
        expect(component.facebook).toHaveBeenCalled();
        expect(component.generateEventsForShare).toHaveBeenCalledWith("Share_Facebook", component.findModuleType());
        expect(analyticsService.createAnalyticsEvent).toHaveBeenCalled();
    });

    it('should share on whatsapp', () => {
        spyOn(component, 'whatapp').and.callThrough();
        spyOn(component, 'generateEventsForShare').and.callThrough();
        spyOn(analyticsService, 'createAnalyticsEvent').and.callFake(() => undefined);
        component.shareSongInfo = new SongMock().getSong();
        fixture.detectChanges();
        let btn: HTMLElement = element.querySelector('.soc-whatsapp');
        btn.click();
        expect(component.whatapp).toHaveBeenCalled();
        expect(component.generateEventsForShare).toHaveBeenCalledWith("Share_WhatsApp", component.findModuleType());
        expect(analyticsService.createAnalyticsEvent).toHaveBeenCalled();
    });

    it('should share on twitter', () => {
        spyOn(component, 'twitter').and.callThrough();
        spyOn(component, 'generateEventsForShare').and.callThrough();
        spyOn(analyticsService, 'createAnalyticsEvent').and.callFake(() => undefined);
        component.shareSongInfo = new SongMock().getSong();
        fixture.detectChanges();
        let btn: HTMLElement = element.querySelector('.soc-twitter');
        btn.click();
        expect(component.twitter).toHaveBeenCalled();
        expect(component.generateEventsForShare).toHaveBeenCalledWith("Share_Twitter", component.findModuleType());
        expect(analyticsService.createAnalyticsEvent).toHaveBeenCalled();
    });

    it('should copy URL to clipboard in desktop', () => {
        spyOn(component, 'copyShareUrl').and.callThrough();
        component.shareSongInfo = new SongMock().getSong();
        fixture.detectChanges();
        let btn = element.querySelectorAll('.soc-twitter');
        (<any>btn[1]).click();
        expect(component.copyShareUrl).toHaveBeenCalled();
    });

    it('should copy URL to clipboard in iOS mobile', () => {
        spyOn(component, 'copyShareUrl').and.callThrough();
        spyOn(commonService, 'isAndroid').and.returnValue(false);
        spyOn(commonService, 'isDesktop').and.returnValue(false);
        spyOn(toastrService, 'show').and.callFake((url) => expect(url).toEqual('URL Copied'));
        component.shareSongInfo = new SongMock().getSong();
        fixture.detectChanges();
        let btn = element.querySelectorAll('.soc-twitter');
        (<any>btn[1]).click();
        expect(component.copyShareUrl).toHaveBeenCalled();
    });
})