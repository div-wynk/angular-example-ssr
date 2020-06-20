import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

    constructor() { }
    sendEvents(eventLabel, eventCategory, eventAction,nonInteractive=false) {
        
        // (<any>window).ga('gtag_UA_109342043_1.send', 'event', {
        //     'eventCategory': eventCategory,
        //     'eventLabel': eventLabel,
        //     'eventAction': eventAction,
        //     'non_interaction': nonInteractive
        // });
    }
    // sendEvents(eventLabel, eventCategory, eventAction) {
    //     (<any>window).ga('send', 'event', {
    //         'eventCategory': eventCategory,
    //         'eventLabel': eventLabel,
    //         'eventAction': eventAction
    //     });
    // }
}