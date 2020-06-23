import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { PersistDataService } from '../../shared/services/persistData.service';
import { ModalPopupService } from '../../shared/services/modal-popup.service';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { Analytics } from '../../analytics/analytics';
import { Constants } from '../../constant/constants';

@Component({
  selector: 'sound-quality',
  templateUrl: 'sound-quality.component.html',
  styleUrls: ['./sound-quality.component.scss']
})

export class SoundQualityComponent implements OnInit{

  @Input() selectedQuality: string;
  @Input() isHdAllowed: boolean;
  @Output() closeModalInput = new EventEmitter();

  constructor(
    private persistDataService: PersistDataService,
    private modalPopUpService: ModalPopupService,
    private _localStorageWrapperService: LocalStorageWrapperService,
    private analyticsService: Analytics
  ){}
  
  ngOnInit(){
    if(!this.selectedQuality) this.selectedQuality = this._localStorageWrapperService.getItem("quality");
  }

  setQuality(level:string){ 
    this.selectedQuality = level;   
    this.persistDataService.setSoundQuality(level);
    this.analyticsService.createAnalyticsEvent(Constants.EVENT_NAME.CLICK, {id: "Streaming_quality"}, Constants.SCREEN_ID.PLAYER);
    setTimeout(()=>{this.closeModal()}, 500);
  }

  openSignInPopup() {
    this.closeModalInput.emit();
    this.modalPopUpService.openLoginModal('HD_Audio', {SIGNIN: 'Enjoy HD audio for free', SIGNIN_POPUP_TEXT: 'Login/sign up with your mobile number to enjoy HD audio for free, only on Wynk Music! You will also get access to personalised recommendations, and your entire library in one place.'});
  }

  closeModal() {
    this.closeModalInput.emit();
  }

}


