/**
* Created by Harish Chandra.
*/
import { Injectable, Inject, Renderer2 } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { DOCUMENT, LowerCasePipe } from '@angular/common';
import { ReplaceWhiteSpace } from '../../pipes/replaceWhitespacePipe/replace-whitespace.pipe';
import { ReplaceCpIds } from '../../pipes/replaceCpIdsPipe/replace-cp-ids.pipe';
import { Constants } from '../../constant/constants';
import { LocalStorageWrapperService } from './localstorage-wrapper.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class MetaTagService {
    private link: HTMLLinkElement;
    public googleStructuredData = {'seoGroupType':'WebSite','title':'','description':'', 'androidUrl':'', 'iosUrl':''};    
    
    constructor(
      private meta: Meta,
      private titleService: Title,
      private _localStorageWrapperService: LocalStorageWrapperService, 
      @Inject(DOCUMENT) private doc,
      private router: Router
    ) { }

    setMetaTags(metaData) {
        metaData.forEach(element => {
            if (element.key.includes("og", 0)) {
                this.meta.updateTag({ property: element.key, content: element.value });
            } else {
                this.meta.updateTag(
                    { name: element.key, content: element.value }
                );
            }

            if (element.key == 'title') {
                this.setTitleTag(element);
            }
        });
        this.removeExistingGoogleStructuredDataScript();
    }

    addValueInMetaArray(key, value, metaArray) {
        return metaArray.push({ 'key': key, 'value': value });
    }

    setTitleTag(element) {
        this.titleService.setTitle(element.value);
    }

    createLinkForCanonicalURL(item = null) {       
        if (this.link === undefined) {
            this.link = this.doc.createElement('link');
            this.link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(this.link);
        }
        if (item != null && item.title) {
            this.link.setAttribute('href', "https://wynk.in/music/" + new LowerCasePipe().transform(item.type) + '/' + new ReplaceWhiteSpace().transform(item.title).toLowerCase() + '/' + new ReplaceCpIds(this._localStorageWrapperService).transform(item.id, item.title).replace('.html',''));
        } else {
            this.link.setAttribute('href', this.doc.URL.split('?')[0].replace('.html','').replace(new RegExp("(http://|https://)(.*?)(/music*)"), environment.WEB_SITE_URL + '$3') );
        }   

    }

    createLinkForCanonicalForArtistURL(id, name) {
        if (this.link === undefined) {
            this.link = this.doc.createElement('link');
            this.link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(this.link);
        }
        
        this.link.setAttribute('href', "https://wynk.in" + (this.router.url.split('?')[0]).replace("/artist", "/artist/" + new ReplaceWhiteSpace().transform(name).toLowerCase()).replace('.html',''));
        
    }

    createLinkForSameCanonical(){
      if (this.link === undefined) {
        this.link = this.doc.createElement('link');
        this.link.setAttribute('rel', 'canonical');
        this.doc.head.appendChild(this.link);
    }
      this.link.setAttribute('href', this.doc.URL.split('?')[0].replace('.html','').replace(new RegExp("(http://|https://)(.*?)(/music*)"), environment.WEB_SITE_URL + '$3') );
    }

    createGoogleStructureData(data: any, pageType: any){
      data.forEach(element => {
          switch (element.key) {
              case "title":
                  this.googleStructuredData.title = element.value;
                  break;
              case "description":
                  this.googleStructuredData.description = element.value;
                  break;
              case "og:url":
                  this.googleStructuredData.androidUrl = element.value.indexOf('?') !=-1 ? element.value.substring(0,element.value.indexOf('?')): element.value;
                  let url = this.googleStructuredData.androidUrl.substring(this.googleStructuredData.androidUrl.indexOf('/music'), this.googleStructuredData.androidUrl.length);
                  if(url == "about:blank"){
                        this.googleStructuredData.androidUrl = null;
                        this.googleStructuredData.iosUrl = null;
                    } else {
                        this.googleStructuredData.androidUrl = "https/wynk.in"+url;
                        this.googleStructuredData.iosUrl = "https://wynk.in"+url;
                    }
                  break;
          }
      });
      //We can add more seoGroupType based on content currently we are implement for artist and album
      //SeoGroupType for artist:- MusicGroup and for album:- MusicAlbum
      this.googleStructuredData.seoGroupType = Constants.STRUCTURED_DATA_TYPE[pageType]; 
      return this.googleStructuredData;
    }

    removeExistingGoogleStructuredDataScript(){
        try {
            document.getElementById("structuredDataScript").remove();
        } catch (error) {
            //console.log('no existing google structured tag found');
        }
    }

    addGoogleStructuredDataScript(data: any, renderer2: Renderer2, pageType: any) {
        let googleScriptData = this.createGoogleStructureData(data, pageType); 
        if(googleScriptData.androidUrl == null && googleScriptData.iosUrl == null){
              return;
        }       
        let s = renderer2.createElement('script');
        s.type = `application/ld+json`;
        s.id = 'structuredDataScript';
        s.text = pageType == 'HOME' ? this.getHomePageStructureData(googleScriptData) : this.getInnerPageStructureData(googleScriptData);
        renderer2.appendChild(this.doc.body, s);
    }

    sanitizeStructuredData(str : string){
      return str.replace(/"/g,"\'")
    }

    getInnerPageStructureData(googleScriptData){
        return `{
            "@context": "http://schema.org",
            "@type": "${googleScriptData.seoGroupType}",
            "url":  "${googleScriptData.iosUrl}?autoplay=true" ,
            "name": "${this.sanitizeStructuredData(googleScriptData.title)}",
            "description": "${this.sanitizeStructuredData(googleScriptData.description)}",
            "potentialAction": [{
              "@type": "ListenAction",
            "expectsAcceptanceOf": {
                "@type": "Offer",
                "eligibleRegion": {
                  "@type": "Country",
                  "name": "IN"
                }
              },
              "target": [
            {
                  "@type":"EntryPoint",
                  "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                  "actionPlatform":[
                    "http://schema.org/IOSPlatform"
                  ]
                },
            {
                  "@type":"EntryPoint",
                  "urlTemplate": "android-app://com.bsbportal.music/${googleScriptData.androidUrl}?autoplay=true",
                  "actionPlatform":[
                    "http://schema.org/AndroidPlatform"
                  ]
                },
            {
                  "@type":"EntryPoint",
                  "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                  "actionPlatform":[
                    "http://schema.org/MobileWebPlatform"
                  ]
                }
              ]
            },
             {
                "@type": "ViewAction",
              "expectsAcceptanceOf": {
                  "@type": "Offer",
                  "eligibleRegion": {
                    "@type": "Country",
                    "name": "IN"
                  }
                },
                "target": [
              {
                    "@type":"EntryPoint",
                    "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                    "actionPlatform":[
                      "http://schema.org/IOSPlatform"
                    ]
                  },
              {
                    "@type":"EntryPoint",
                    "urlTemplate": "android-app://com.bsbportal.music/${googleScriptData.androidUrl}?autoplay=true",
                    "actionPlatform":[
                      "http://schema.org/AndroidPlatform"
                    ]
                  },
              {
                    "@type":"EntryPoint",
                    "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                    "actionPlatform":[
                      "http://schema.org/MobileWebPlatform"
                    ]
                  }
                ]
              }
            ]
          }
        `;
    }
    
    getHomePageStructureData(googleScriptData){
        return `
        {
            "@context": "http://schema.org",
            "@type": "${googleScriptData.seoGroupType}",
            "url":  "${googleScriptData.iosUrl}?autoplay=true" ,
            "name": "Wynk Music",
            "description": "${googleScriptData.description}",
            "parentOrganization":"Bharti Airtel",
            "foundingDate":"2014",
            "logo":"https://lh3.googleusercontent.com/pekXClYKVaYHIT8dM4WOsA7l7sNVfatNWP0zFzBaGrLvJk6FupFsr9NfvOBRmjKO_J8=s360-rw",
            "contactPoint" : 
            { "@type" : "ContactPoint",
              "name" : "contact@wynk.in",
              "contactType" : "customer support",
              "url":"https://wynk.in/music"
            },
            "location": {
              "@type": "Place",
              "name": "Gurgaon"
            },
            "potentialAction": [{
              "@type": "ListenAction",
            "expectsAcceptanceOf": {
                "@type": "Offer",
                "eligibleRegion": {
                  "@type": "Country",
                  "name": "IN"
                }
              },
              "target": [
            {
                  "@type":"EntryPoint",
                  "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                  "actionPlatform":[
                    "http://schema.org/IOSPlatform"
                  ]
                },
            {
                  "@type":"EntryPoint",
                  "urlTemplate": "android-app://com.bsbportal.music/${googleScriptData.androidUrl}?autoplay=true",
                  "actionPlatform":[
                    "http://schema.org/AndroidPlatform"
                  ]
                },
            {
                  "@type":"EntryPoint",
                  "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                  "actionPlatform":[
                    "http://schema.org/MobileWebPlatform"
                  ]
                }
              ]
            },
             {
                "@type": "ViewAction",
              "expectsAcceptanceOf": {
                  "@type": "Offer",
                  "eligibleRegion": {
                    "@type": "Country",
                    "name": "IN"
                  }
                },
                "target": [
              {
                    "@type":"EntryPoint",
                    "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                    "actionPlatform":[
                      "http://schema.org/IOSPlatform"
                    ]
                  },
              {
                    "@type":"EntryPoint",
                    "urlTemplate": "android-app://com.bsbportal.music/${googleScriptData.androidUrl}?autoplay=true",
                    "actionPlatform":[
                      "http://schema.org/AndroidPlatform"
                    ]
                  },
              {
                    "@type":"EntryPoint",
                    "urlTemplate": "${googleScriptData.iosUrl}?autoplay=true",
                    "actionPlatform":[
                      "http://schema.org/MobileWebPlatform"
                    ]
                  }
                ]
              }
            ]
          }
        `;
    }
    
}