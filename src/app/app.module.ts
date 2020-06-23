import { SoundQualityComponent } from './component/sound-quality/sound-quality.component';
import { HomeComponent } from './modules/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LoaderService } from './shared/services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PipeModule } from './pipes/pipe.module';
import { LoaderComponent } from './component/loader/loader.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ImageLazyLoadModule } from './directives/image-lazy-load/image-lazy-load.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SocialShareComponent } from './component/social-share/social-share.component';
import { DownloadPopupComponent } from './component/download-popup/download-popup.component';
import { WarningPopupComponent } from './component/warning-popup/warning-popup.component';
import { TitleCasePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AddPlaylistComponent } from './component/add-playlist/add-playlist.component';
import { ToastrComponent } from './component/toastr/toastr.component';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { PopoverModule } from './component/popover/popover.module';
import { HeaderInterceptor } from './http-interceptor/header.interceptor';
import { LoginComponent } from './component/login/login.component';
import { FoterComponent } from './component/footer/footer.component';
import { TopNavComponent } from './component/top-nav/top-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopNavComponent,
    SoundQualityComponent,
    FoterComponent,
    LoginComponent,
    LoaderComponent,
    DownloadPopupComponent,
    SocialShareComponent,
    AddPlaylistComponent,
    WarningPopupComponent,
    ToastrComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    AppRoutingModule,
    TransferHttpCacheModule,
    ToastNoAnimationModule,
    HttpClientModule,
    ToastrModule.forRoot({
      toastComponent: ToastrComponent,
      positionClass: 'toast-bottom-center',
      toastClass: 'toast',
      //disableTimeOut:true,
      timeOut: 4000
    }),
    ImageLazyLoadModule,
    PipeModule,
    NgbModule,
    PopoverModule
  ],
   providers: [CookieService, TitleCasePipe,LoaderService,
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: HeaderInterceptor, multi: true 
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, SocialShareComponent, AddPlaylistComponent, DownloadPopupComponent, WarningPopupComponent, ToastrComponent,SoundQualityComponent]

})
export class AppModule { }
