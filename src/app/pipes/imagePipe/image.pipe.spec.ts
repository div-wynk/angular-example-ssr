import { TestBed, inject } from '@angular/core/testing';
import { ImagePipe } from './image.pipe';
import { CommonService } from '../../shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http';

describe('ImagePipe', () => {

    const CAROUSEL_URL = 'http://img.wynk.in/unsafe/50x50/top/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/Ladies-Night-720x251r.png';
    const SONG_MD_URL = 'http://img.wynk.in/unsafe/120x120/top/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/1574847243/50429720.jpg';
    const URL_WITHOUT_IMG_URL = 'http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/lazy-lamhe-720x251.png';

    beforeEach(() => {
      TestBed
        .configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule,
                HttpClientModule
            ],
            providers: [
                CommonService,
                CookieService,
                TitleCasePipe
            ]
        });
    });

    it('should create an instance', (inject([CommonService], common_service => {
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe).toBeTruthy();
    })));

    it('should return undefined for no URL', (inject([CommonService], common_service => {
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(undefined, undefined)).toEqual(undefined);
    })));
    
    it('should return URL for Carousel with size 720x251', (inject([CommonService], common_service => {
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(CAROUSEL_URL, 'CAROUSEL')).toEqual("https://img.wynk.in/unsafe/720x251/filters:no_upscale():format(webp)/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/Ladies-Night-720x251r.png");
    })));

    it('should return URL for SONG with size 150x150', (inject([CommonService], common_service => {
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(SONG_MD_URL, 'SONG-MD')).toEqual("https://img.wynk.in/unsafe/150x150/filters:no_upscale():format(webp)/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/1574847243/50429720.jpg");
    })));

    it('should return URL with IMG URL domain', (inject([CommonService], common_service => {
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(URL_WITHOUT_IMG_URL, 'CAROUSEL')).toEqual("https://img.wynk.in/unsafe/720x251/filters:no_upscale():format(webp)/https://s3-ap-southeast-1.amazonaws.com/bsbcms/music/lazy-lamhe-720x251.png");
    })));

    it('should return JPG format for iOS', (inject([CommonService], common_service => {
        spyOn(common_service, 'getOperatingSystem').and.returnValue("iOS");
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(SONG_MD_URL, 'SONG-MD')).toEqual("https://img.wynk.in/unsafe/150x150/filters:no_upscale():format(jpg)/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/1574847243/50429720.jpg");
    })));

    it('should return JPG format for browser details {browser: not found} ', (inject([CommonService], common_service => {
        common_service.BROWSER_DETAILS = {browser: 'not found', version: ''};
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(SONG_MD_URL, 'SONG-MD')).toEqual("https://img.wynk.in/unsafe/150x150/filters:no_upscale():format(jpg)/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/1574847243/50429720.jpg");
    })));

    it('should return JPG format for Edge v17 ', (inject([CommonService], common_service => {
        common_service.BROWSER_DETAILS = {browser: 'edge', version: '17'};
        let imagePipe = new ImagePipe(common_service);
        expect(imagePipe.transform(SONG_MD_URL, 'SONG-MD')).toEqual("https://img.wynk.in/unsafe/150x150/filters:no_upscale():format(jpg)/http://s3-ap-southeast-1.amazonaws.com/bsbcms/music/1574847243/50429720.jpg");
    })));
    
});