import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundQualityComponent } from './sound-quality.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersistDataService } from '../../shared/services/persistData.service';
import { Analytics } from '../../analytics/analytics';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { CookieService } from 'ngx-cookie-service';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ModalPopupService } from '../../shared/services/modal-popup.service';

describe('SoundQualityComponent', () => {
  let component: SoundQualityComponent;
  let fixture: ComponentFixture<SoundQualityComponent>;
  let el: HTMLElement;
  let localStorageService;
  let modalPopupService;
  let persistDataService;
  let analyticsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            CommonModule,
            RouterTestingModule,
            HttpClientModule
        ],
        declarations: [ SoundQualityComponent ],
        providers: [
            NgbActiveModal,
            PersistDataService, 
            Analytics, 
            LocalStorageWrapperService,
            CookieService,
            TitleCasePipe,
            ModalPopupService
        ]
    })
    .compileComponents();

    localStorageService = TestBed.get(LocalStorageWrapperService);
    modalPopupService = TestBed.get(ModalPopupService);
    persistDataService = TestBed.get(PersistDataService);
    analyticsService = TestBed.get(Analytics);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundQualityComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have AUTO selected', () => {
    component.selectedQuality = 'Auto';
    component.isHdAllowed = false;
    fixture.detectChanges();
    let selected = el.querySelector('.selected');
    expect(selected.textContent.trim()).toEqual('Auto');
  });

  it('should have MED selected', () => {
    component.selectedQuality = 'Med';
    component.isHdAllowed = false;
    fixture.detectChanges();
    let selected = el.querySelector('.selected');
    expect(selected.textContent.trim()).toEqual('Med 64 kbps');
  });

  it('should have HIGH selected', () => {
    component.selectedQuality = 'High';
    component.isHdAllowed = false;
    fixture.detectChanges();
    let selected = el.querySelector('.selected');
    expect(selected.textContent.trim()).toEqual('High 128 kbps');
  });

  it('should show login message when HD is not allowed', () => {
    component.selectedQuality = 'High';
    component.isHdAllowed = false;
    fixture.detectChanges();
    let loginHD = el.querySelector('.login-with-HD');
    expect(loginHD).toBeDefined();
  });

  it('should have HD selected', () => {
    component.selectedQuality = 'HD';
    component.isHdAllowed = true;
    fixture.detectChanges();
    let selected = el.querySelector('.selected');
    let loginHD = el.querySelector('.login-with-HD');
    expect(loginHD).toBeNull();
    expect(selected.textContent.trim()).toEqual('HD 320/256 kbps');
  });

  it('Quality should be loaded from localStorage when it is not passed', () => {
    component.isHdAllowed = true;
    spyOn(localStorageService, 'getItem').and.returnValue('HD');
    fixture.detectChanges();
    expect(component.selectedQuality).toEqual("HD");
    let selected = el.querySelector('.selected');
    expect(selected.textContent.trim()).toEqual('HD 320/256 kbps');
  });

  it('Should open signin popup when HD is selected', async () => {
    spyOn(modalPopupService, "openLoginModal").and.callFake(() => undefined);
    component.selectedQuality = 'Auto';
    component.isHdAllowed = false;
    component.closeModalInput.subscribe((called) => expect(called).toBeUndefined());
    spyOn(component, "openSignInPopup").and.callThrough();
    fixture.detectChanges();

    let button: HTMLElement = el.querySelector('.login-with-HD button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.openSignInPopup).toHaveBeenCalled();
      expect(modalPopupService.openLoginModal).toHaveBeenCalledWith('HD_Audio', {SIGNIN: 'Enjoy HD audio for free', SIGNIN_POPUP_TEXT: 'Login/sign up with your mobile number to enjoy HD audio for free, only on Wynk Music! You will also get access to personalised recommendations, and your entire library in one place.'});
    });
  });

  it('Modal should close on clicking close', () => {
    spyOn(component, "closeModal").and.callThrough();
    component.closeModalInput.subscribe((called) => expect(called).toBeUndefined());
    let button: HTMLElement = el.querySelector('.close');
    button.click();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('setQuality as per level passed', (done) => {
    spyOn(component, "setQuality").and.callThrough();
    spyOn(persistDataService, "setSoundQuality").and.callFake((level) => undefined);
    spyOn(analyticsService, "createAnalyticsEvent").and.callFake(() => undefined);
    spyOn(component, "closeModal").and.callThrough();
    component.selectedQuality = 'Auto';
    fixture.detectChanges();
    let button: HTMLElement = el.querySelector('button[title="64 kbps"]');
    button.click();

    expect(component.setQuality).toHaveBeenCalledWith("Med");
    expect(component.selectedQuality).toEqual("Med");
    expect(persistDataService.setSoundQuality).toHaveBeenCalledWith("Med");
    expect(analyticsService.createAnalyticsEvent).toHaveBeenCalledWith("click", {id: "Streaming_quality"}, "PLAYER");
    setTimeout(() => {
      expect(component.closeModal).toHaveBeenCalled();
      done();
    }, 500);
  });

});