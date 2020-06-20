import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestManager } from '../../http-manager/http-manager.service';
import { LoginService } from './service/login.service';
import { CommonService } from '../../shared/services/common.service';
import { PersistDataService } from '../../shared/services/persistData.service';
import { ToastrService } from 'ngx-toastr';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';
import { AppUtil } from '../../utils/AppUtil';
import { LoaderService } from '../../shared/services/loader.service';
import { Router } from '@angular/router';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
// import { TfaService } from '../../shared/services/tfa.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [HttpRequestManager, LoginService]
})
export class LoginComponent {

  @Input() reasonToOpen;

  public showLogin = true;
  public signinFormValid: boolean = false;
  public otpFormValid: boolean = false;
  public signinFormTouched: boolean = false;
  public otpFormTouched: boolean = false;
  private validPhoneNumberRegx = /^[[6789][0-9]{9}]*$/;
  private validOtpRegx = /^[[0-9]{4}]*$/;
  public phoneno: string = '';
  public validOtp: string = '';
  private deviceId: any;
  private userAgent: string;
  @Input() public languageConstants : any;
  public modifyMobileView: boolean = false;
  @ViewChild('phoneNo', {static:false}) phoneNoRef: ElementRef;
  @ViewChild('otp', {static:false}) otpRef: ElementRef;
  constructor(
    public activeModal: NgbActiveModal,
    private loginService: LoginService,
    private commonService: CommonService,
    private persistDataService: PersistDataService,
    private toasterService: ToastrService,
    private analytics: Analytics,
    private appUtil: AppUtil,
    private loaderService: LoaderService,
    private router: Router,
    private _localStorageWrapperService: LocalStorageWrapperService
    // private tfkService: TfaService
  ) {    
  }

  ngOnInit() {
    this.modifyMobileView = this.commonService.modifyMobileView();
    this.deviceId = this.commonService.getDeviceId();
    this.userAgent = this.commonService.getUserAgent();
    this.popUpLoadEvent();
    this.persistDataService.isFreshUser$.subscribe(res => {
      if (res) {
        this.popUpLoadEvent()
      }
  });    
    this.languageConstants = this.languageConstants || Constants.LANGUAGE_CONSTANTS;
  }

  popUpLoadEvent() {
    let meta = this.generateEventsForLogIn("Register");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_OPENED, meta, Constants.SCREEN_ID.REGISTER);
  }

  ngOnDestroy() {
    let meta = this.generateEventsForLogIn("Register");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_CLOSED, meta, Constants.SCREEN_ID.REGISTER);
  }

  onSignin(isFirstTime) {

    const payload = {
      'msisdn': this.phoneno
    }

    if (this.signinFormValid) {
      this.showLogin = false;
      this.loginService.getOtp(payload, this.deviceId, this.userAgent).subscribe(res => {
        if (isFirstTime) {
          this.verificationEvent(Constants.EVENT_NAME.SCREEN_OPENED);
        }
        setTimeout(() => {
          this.otpRef.nativeElement.focus();
        }, 300)
      },
        error => {
          console.log("error block", error.message);
        })
    }
  }

  isFormValid(name) {
    if (name == 'signinForm') {
      this.phoneno = this.phoneNoRef.nativeElement.value;
      this.signinFormValid = this.validPhoneNumberRegx.test(this.phoneno) && this.phoneno.length == 10 ? true : false;
      this.signinFormTouched = this.phoneno.length == 10 ? true : false;
    }
    if (name == 'otpForm') {
      this.validOtp = this.otpRef.nativeElement.value;
      this.otpFormValid = this.validOtpRegx.test(this.validOtp) && this.validOtp.length == 4 ? true : false;
    }
  }


  onSubmitOTP() {

    const payload = {
      'appversion': '1.0',
      'deviceid': this.deviceId,
      'devicetype': this.userAgent,
      'msisdn': this.phoneno,
      'otp': this.validOtp,
      'userAgent': this.userAgent,
      'resolution': window.screen && window.screen.height + "X" + window.screen.width
    }

    let meta = this.generateEventsForLogIn("OTP_Entered");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.REGISTER);

    if (this.otpFormValid) {
      this.loginService.verifyOtp(payload, this.deviceId, this.userAgent).subscribe(res => {

        if (this.router.url == Constants.HOMEPAGE_URL) { this.loaderService.loaderState(true); }
        this.toasterService.show(Constants.TOAST_MESSAGE.LOGGED_IN);

        let loggedInCookies = {
          msisdn: this.phoneno,
          token: res.token,
          uid: res.uid,
        }
        this.commonService.saveRequiredParams(res.dt, res.kt, res.server_timestamp);
        // this.tfkService.updateTek();
        this.commonService.setUserDetailsObj(res.config);
        this.commonService.setCookieForLoggedInUser(loggedInCookies);
        this.persistDataService.setCookieForLoggedInUser(loggedInCookies);
        this.persistDataService.setUserLoggedIn(true);
        this.persistDataService.isFeaturedDataUpdated(true);
        this.persistDataService.setRplList([]);

        this.activeModal.close();
        
        this.verificationEvent(Constants.EVENT_NAME.SCREEN_CLOSED);
        let meta = this.generateEventsForLogIn("Sign_In_Successfull");
        meta['msisdn'] = this.phoneno;
        this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SIGNIN, meta, Constants.SCREEN_ID.REGISTER);
        if(this.reasonToOpen && (this.reasonToOpen === 'song_page_recommendation' || this.reasonToOpen === 'playlist_page_recommendation' || this.reasonToOpen === 'artist_page_recommendation' || this.reasonToOpen === 'album_page_recommendation')){
          this.router.navigate(['/music/my-music/recommended-songs']);
        }
        if (this.reasonToOpen && this.reasonToOpen === 'HD_Audio'){
          this.persistDataService.setSoundQuality("HD");
        }
      },
        error => {
          console.log(error);
          if (error.error.errorCode == 'BSY004') {
            this.otpFormValid = false;
            this.otpFormTouched = true;
          }
        })
    }
  }

  resendOtp() {
    this.onSignin(false);
    let meta = this.generateEventsForLogIn("Pin_Resend");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.REGISTER);
  }

  editForm() {
    this.showLogin = true;
    this.validOtp = '';
    this.otpFormValid = false;
    this.otpFormTouched = false;
    let meta = this.generateEventsForLogIn("Edit_Number");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.REGISTER);
    this.verificationEvent(Constants.EVENT_NAME.SCREEN_CLOSED);
    setTimeout(() => {
      this.phoneNoRef.nativeElement.focus();
    }, 300)
  }

  keyPress(event) {
    if (event.charCode < 48 || event.charCode > 57) {
      return false;
    }
    return true;
  }

  generateEventsForLogIn(id) {
    let meta: any = {};
    meta.id = id;
    meta["Reason"] = this.reasonToOpen;
    return meta;
  }

  verificationEvent(value) {
    let meta = this.generateEventsForLogIn("Verify_Pin");
    this.analytics.createAnalyticsEvent(value, meta, Constants.SCREEN_ID.REGISTER);
  }

  getApp(value) {

    let meta;
    if (!value) {
      meta = this.generateEventsForLogIn("iOS_Install");

    } else {
      meta = this.generateEventsForLogIn("Android_Install");
    }
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, meta, Constants.SCREEN_ID.REGISTER);

    let url = this.appUtil.getAppUrl(value);
    //window.location.href = url;
    window.open(url, '_blank');
  }

  closeLoginModal() {
    this.activeModal.dismiss('Cross click');
    let meta = this.generateEventsForLogIn("Register");
    this.analytics.createAnalyticsEvent(Constants.EVENT_NAME.SCREEN_CLOSED, meta, Constants.SCREEN_ID.REGISTER);
  }

}

