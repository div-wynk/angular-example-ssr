/**
* Created by Harish Chandra.
*/
// Imports
import { Injectable } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { Constants } from '../constant/constants';
import { HttpRequestManager } from '../http-manager/http-manager.service';
import { environment } from '../../environments/environment';
import { PersistDataService } from '../shared/services/persistData.service';
import { LocalStorageWrapperService } from '../shared/services/localstorage-wrapper.service';


@Injectable({ providedIn: 'root' })
export class Analytics {
    constructor(
        private commonService: CommonService, 
        private httpRequetManager: HttpRequestManager,
        private persistDataService: PersistDataService,
        private _localStorageWrapperService: LocalStorageWrapperService
    ) { }

    this = this;
    userObj = this.commonService.getCookieForNonLoggedInUser();

    createSongPlayedLongEvent(songObj, time, src, urlUtmSource, screenId, quality, quality_setting) {
        let meta: any = {};
        meta["dark-theme"] = this.commonService.getTheme();
        meta.id = songObj.id;
        meta.duration = parseInt(time);
        meta.auto_played = false;
        meta.sq = this.getSongQuality();
        meta.type = songObj.type;
        meta.url = src;
        meta.source = urlUtmSource;
        meta.quality = quality;
        meta.quality_setting = quality_setting;
        this.pushEventToQueue('SONG_PLAYED_LONG', meta, true, screenId);
    };

    createSongPlayedEvent(songObj) {
        let meta: any = {};
        meta.id = songObj.id;
        meta.type = songObj.type;
        meta.ds = false;
        meta.offline = false;
        meta.screen_id = this.commonService.getScreenId();
        this.pushEventToQueue('SONG_PLAYED', meta, true, "");
    }

    createSongEndedEvent(songObj) {
        let meta: any = {};
        meta.id = songObj.id;
        meta.type = songObj.type;
        meta.cache = false;
        meta.offline = false;
        this.pushEventToQueue('SONG_ENDED', meta, false, "");
    }
    createRequestTimeEvent(duration, stream) {
        let meta: any = {};
        meta.url = window.location.href;
        meta.duration = duration;
        meta.stream = stream;
        this.pushEventToQueue('REQUEST_TIME', meta, false, "");
    }

    createSongCompletedEvent(songObj) {
        let meta: any = {};
        meta.id = songObj.id;
        meta.type = songObj.type;
        meta.offline = false;
        this.pushEventToQueue('SONG_COMPLETED', meta, false, "");
    }

    createDevStatsEvent(t) {
        let meta: any = {};
        meta.timingParams = {};
        meta.timingParams.DOMContentLoad = (t.domComplete - t.domLoading) / 1000;
        meta.timingParams.PerceivedPerformance = (t.loadEventEnd - t.navigationStart) / 1000;
        meta.timingParams.LoadTime = (t.loadEventEnd - t.responseEnd) / 1000
        meta.timingParams.DOMProcessingToInteractive = (t.domInteractive - t.domLoading) / 1000;
        meta.timingParams.DOMInteractiveToComplete = (t.domComplete - t.domInteractive) / 1000;
        this.pushEventToQueue('DEV_STATS', meta, false, "");
    };

    createAppStartedEvent() {
        let meta: any = {};
        this.pushEventToQueue("APP_STARTED", meta, false, "");
    };

    createAppInfoEvent() {
        let meta: any = {};
        this.pushEventToQueue("APP_INFO", meta, false, "");
    };

    createAppClosedEvent() {
        let meta: any = {};
        meta.screen_id = this.commonService.getScreenId();
        this.pushEventToQueue("APP_CLOSED", meta, false, "");
    };

    createAppSwitchEvent(visibilityState) {
        let meta: any = {};
        meta.screen_id = this.commonService.getScreenId();
        if (visibilityState == "visible")
            this.pushEventToQueue("APP_FOREGROUND", meta, false, "");
        else if (visibilityState == "hidden")
            this.pushEventToQueue("APP_BACKGROUND", meta, false, "");
    }

    createItemDequeuedEvent(ids, type, isClearAll) {
        let meta: any = {};
        meta.ids = ids;
        meta.type = type;
        meta.clear_all = isClearAll;
        meta.screen_id = this.commonService.getScreenId();
        this.pushEventToQueue("ITEM_DEQUEUED", meta, false, "");
    }

    createItemQueuedEvent(contentId, type, moduleId) {
        let meta: any = {};
        meta.contentId = contentId;
        meta.type = type;
        meta.module_id = moduleId;
        meta.Queue_size = this.persistDataService.queuedSongList.length;
        this.pushEventToQueue("ITEM_QUEUED", meta, false, this.commonService.getScreenId());
    }

    createItemSearchConsumedEvent(item, searchText, row, col, tid) {
        let meta: any = {};
        meta.item_id = item.id;
        meta.type = item.type;
        meta.keyword = searchText;
        meta.item_rank = col;
        meta.module_rank = row;
        meta.clicked_on = "entity";
        meta.tid = tid;
        this.pushEventToQueue("ITEM_SEARCH_CONSUMED", meta, false, "");
    }

    createItemSharedEvent(medium, content) {
        let meta: any = {};
        meta.channel = medium;
        meta.type = content.type && content.type.toLowerCase();
        meta.id = content.id;
        meta.screen_id = this.commonService.getScreenId();
        this.pushEventToQueue("ITEM_SHARED", meta, false, "");
    };

    createLanguageChangedEvent(langArray) {
        let meta: any = { selectedLang: langArray };
        this.pushEventToQueue("LANG_CHANGED", meta, false, "");
    };

    createNotConsumedEvent(searchedString) {
        let meta: any = {};
        meta.type = "search";
        meta.searchedString = searchedString;
        meta.success = true;
        this.pushEventToQueue("NOT_CONSUMED", meta, false, "");
    };

    createQueueSizeEvent(count) {
        let meta: any = {};
        meta.queueSongCount = count;
        this.pushEventToQueue("QUEUE_SIZE", meta, false, "");
    };

    createScreenOpenedEvent(screenId, fromState) {
        let metaId = screenId || fromState;
        if (metaId) {
            let meta: any = {}
            meta.id = Constants.SCREEN_ID[metaId];
            (metaId != Constants.SCREEN_ID.EXTERNAL_WEBVIEW) && this.commonService.setScreenId(Constants.EVENT_NAME.SCREEN_OPENED,metaId);
            meta.id && this.pushEventToQueue("SCREEN_OPENED", meta, false, "");
        }

    }

    createScreenClosedEvent(screenId, fromState) {
        let metaId = screenId || fromState;
        if (metaId) {
            let meta: any = {};
            meta.id = Constants.SCREEN_ID[metaId];
            meta.id && this.pushEventToQueue("SCREEN_CLOSED", meta, false, "");
        }
    }

    createDownloadStartEvent(id) {
        let meta: any = {};
        meta.screen_id = this.commonService.getScreenId();
        meta.type = "song";
        meta.id = id;
        this.pushEventToQueue("ITEM_DOWNLOAD_STARTED", meta, false, "");
    };

    createDownloadFailedEvent(id) {
        let meta: any = {};
        meta.type = "song";
        meta.id = id;
        this.pushEventToQueue("ITEM_DOWNLOADING_FAILED", meta, false, "");
    };

    createSignInAbandonedEvent() {
        let meta: any = {};
        meta.screen_id = this.commonService.getScreenId();
        this.pushEventToQueue("SIGNIN_ABANDONED", meta, false, "");
    };

    createSOSEvent(url, status) {
        let meta: any = {};
        meta.url = url;
        meta.status = status;
        this.pushEventToQueue("SOS", meta, false, "");
    };

    createPageLoadedEvent(data) {
        let meta: any = {};
        meta.url = data.url;
        meta.duration = data.duration;
        this.pushEventToQueue("PAGE_LOADED", meta, false, "");
    };

    createItemClickEvent(content, details) {
        let meta: any = {};
        details = details || {};
        meta.id = content.id;
        meta.type = content.type;
        meta.screen_id = (details.screenId) || this.commonService.getScreenId();
        if (details.moduleId) meta.module_id = details.moduleId;
        if (details.row || details.row == 0) meta.row = details.row;
        if (details.column || details.column == 0) meta.column = details.column;
        if (details.keyword) meta.keyword = details.keyword;
        this.pushEventToQueue("CLICK", meta, false, "");
    }

    createButtonClickEvent(details) {
        let meta: any = {};
        meta = details;
        meta.screen_id = (details && details.screen_id) || this.commonService.getScreenId();
        this.pushEventToQueue("CLICK", meta, false, "");
    }

    createAutoChangeEvent(details) {
        let meta: any = {};
        meta = details;
        meta.screen_id = (details && details.screen_id) || this.commonService.getScreenId();
        this.pushEventToQueue("AUTO_CHANGE", meta, false, "");
    }

    getSongQuality() {
        return "m";

    };

    createItemSearchEvent(tid, text) {
        let meta: any = {};
        meta.source = "auto suggest",
            meta.search_within_playlist = "off",
            meta.search_within_playlist_id = "",
            meta.mode = "online",
            meta.history = false,
            meta.search_results = "only_online",
            meta.keyword = text;
        meta.tid = tid;
        this.pushEventToQueue("ITEM_SEARCH", meta, false, "");
    }

    pushEventToQueue(type, meta, forceFlush, screenId) {
        if(this._localStorageWrapperService.isPlatformServer()) {
            return true;
        }
        if (type) {
            let eventQueue = this.commonService.getEventList("events") || [];
            let event: any = {};
            event.event_type = type;
            event.meta = meta;
            event.did = this.commonService.getDeviceId();
            event.timestamp = Date.now();
            event.isdesktop = this.commonService.isDesktop();
            event.apptype = 'wap';
            //event.source = constant.SOURCE;
            event.referrer = document.referrer;
            event.userAgent = this.commonService.getUserAgent();
            event.browser = this.commonService.getBrowserName();
            event.os = this.commonService.getOperatingSystem();
            this.commonService.getParameterByName("rr", '') ? event.customReferrer = this.commonService.getParameterByName("rr", '') : '';
            this.commonService.getParameterByName("r", '') ? event.referrerFromURI = this.commonService.getParameterByName("r", '') : '';
            event.screenId = screenId;
            eventQueue.push(event);
            if (eventQueue.length >= 10 || forceFlush) {
                let queueToPost = eventQueue.slice(0);
                this.commonService.removeEventsFromCache("events");
                this.flushEventQueue(queueToPost);
            }
            else
                this.commonService.setEventList("events",eventQueue);
        }
    }

    flushEventQueue(eventQueue) {
        if(this._localStorageWrapperService.isPlatformServer()) return;
        let uri = '/music/v2/stats';
        let userObj = this.commonService.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser() || this.commonService.getCookieForNonLoggedInUser() || this.persistDataService.getCookiesForNonLoggedInUser();
        let userDetailsObj = this.commonService.getUserDetailsObj() || {};
        let token;
        let postObj;
        if (userObj && userObj.token && userObj.uid) {
            this.setUserObjectPropertiesInEvents(eventQueue);
            postObj = { timeStamp: Date.now(), id: this.commonService.generateRandomId(), events: eventQueue };
            token = this.commonService.signHeader(encodeURI(uri), 'POST', userObj.token, userObj.uid, postObj);
        }
        else {
            //self.postAccountCall();
            return;
        }
        this.httpRequetManager.post(environment.USER_CONTENT_URL + uri, token, postObj, uri, '', '').subscribe(res => {
        },
            error => {
                console.log(error, "Error is");
            })
    }

    setUserObjectPropertiesInEvents(eventQueue) {
        let userDetailsObj = this.commonService.getUserDetailsObj() && this.commonService.getUserDetailsObj().profile;
        if (userDetailsObj) {
            for (let i = 0; i < eventQueue.length; i++) {
                eventQueue[i].uid = userDetailsObj.uid;
                eventQueue[i].lang = "en";
            }
        }
    }

    createAnalyticsEvent(eventType, meta, screenId) {

        if (Constants.HIGH_PRIORITY_EVENT.find(event => event == eventType)) {
            this.pushEventToQueue(eventType, meta, true, screenId);
        }
        else {
            this.pushEventToQueue(eventType, meta, false, screenId);
        }
        if(eventType === Constants.EVENT_NAME.SCREEN_CLOSED || eventType === Constants.EVENT_NAME.SCREEN_OPENED){
            this.commonService.setScreenId(eventType, screenId);
        }
    }

    addSearchResultMoreClickAnalitics(keyword, data, railIndex) {
        let meta = {};
        meta["keyword"] = keyword;
        meta["source"] = this.commonService.searchResultSource ? this.commonService.searchResultSource : 'fresh search';
        meta["type"] = data.id;
        meta["module_rank"] = railIndex;
        meta["item_rank"] = "16"; //user clicked on more
        this.createAnalyticsEvent(
            Constants.EVENT_NAME.ITEM_SEARCH_CONSUMED,
            meta,
            Constants.SCREEN_ID.SEARCH
        );
    }

    addSearchResultSingleClickAnalitics(songinfo, index, railIndex) {
        let meta = {};
        meta["id"] = 'songID';
        meta["song_id"] = songinfo.id;
        meta["type"] = songinfo.type;
        meta["module_rank"] = railIndex;
        meta["item_rank"] = index;
        this.createAnalyticsEvent(
            Constants.EVENT_NAME.CLICK,
            meta,
            Constants.SCREEN_ID.SEARCH
        );
    }

}