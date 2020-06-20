/**
 * Created by Harish Chandra.
 */
import { Injectable } from "@angular/core";
import { Constants } from "../../constant/constants";
// import HmacSHA1 from "crypto-js/hmac-sha1";
// import SHA1 from "crypto-js/sha1.js";
// import Hex from "crypto-js/enc-hex.js";
// import Base64 from "crypto-js/enc-base64.js";
import * as CryptoJS from 'crypto-js';
import { PersistDataService } from "./persistData.service";
import { TitleCasePipe, LowerCasePipe } from '@angular/common';
import { Router } from "@angular/router";
import { ReplaceWhiteSpace } from "../../pipes/replaceWhitespacePipe/replace-whitespace.pipe";
import { ReplaceCpIds } from "../../pipes/replaceCpIdsPipe/replace-cp-ids.pipe";
import { LocalStorageWrapperService } from "./localstorage-wrapper.service";
import { LoggerService } from "./logger.service";
import { ErrorConstants } from "../../constant/error_constants";
import { environment } from './../../../environments/environment';
import { Subject, BehaviorSubject } from "rxjs";
// import { TfaService } from "./tfa.service";
declare var buffer: any;

@Injectable({ providedIn: "root" })
export class CommonService {
  deviceId: any;
  userDetailsObj: any;
  playlists: any;
  playerObj: any;
  screenId: any;
  userStateContent: any;
  isSelectMenuFixed: boolean;
  browserType: any;
  isUcBrowser: any;
  isSamsung: boolean;
  unisearchAutoSuggestData: any;
  BROWSER_DETAILS: any;
  searchResultSource: string;
  searchDataList: any;
  previousPageUrl: string;
  screenStack : string [] = [];
  public featuredArray: number = -1;
  public scrollPos: number=0;
  public backClicked:boolean=false;
  private pwaPrompt;
  public moveBack = false;
  private e2 = 9;
  public w = 'w';
  private imgEvent = new BehaviorSubject(null);
  public imgEvent$ = this.imgEvent.asObservable();

  public goOnBuddy = new BehaviorSubject(null);
  public goOnBuddy$ = this.goOnBuddy.asObservable();
  public BS: string = '';
  public BK: string = this.genBk();
  public cip: string;
  public y = 'y';
  public n = 'n';
  public k = 'k';
  public m = 'm';
  public z = 'z';
  public a = 'a';
  public p = 'p';
  // public theme: string = 'dark';

  private theme = new BehaviorSubject<string>("dark");
  public theme$ = this.theme.asObservable();

  constructor(
    public persistDataService: PersistDataService,
    private titlecasePipe: TitleCasePipe,
    private router: Router,
    private _localStorageWrapperService: LocalStorageWrapperService,
    private loggerService: LoggerService
    // private tfaService: TfaService,
  ) {

    this.browserType = this.detectBrowser();
    this.isUcBrowser = this.isUCBrowser();
    this.isSamsung = this.isSamsungBrowser();
    this.BROWSER_DETAILS = this.getBrowserDetails();
    this.setThemeFromCookie();

    window.addEventListener('beforeinstallprompt', (e) => {
      this.persistDataService.isPwaPushShow.next(true);
      e.preventDefault();
      this.pwaPrompt = e;
    });
    window.addEventListener('appinstalled', (e) => {
      this.persistDataService.isPwaPushShow.next(false);
    });
  }

  setThemeFromCookie(){
    if(this._localStorageWrapperService.checkcookies("theme")){
      this.theme.next(this._localStorageWrapperService.getCookies("theme"));
    }else{
      this.theme.next("dark");
    }
  }

  getTheme(){
    return this.theme.value;
  }
  setTheme(theme: string){
    theme === "dark"? document.body.classList.add("dark") : document.body.classList.remove("dark");
    const now = new Date();
    const exp = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    this._localStorageWrapperService.setCookie("theme",theme,exp,'/');
    this.theme.next(theme);
  }

  toggleTheme(){
    let mode = ""
    if(this._localStorageWrapperService.checkcookies("theme")){
       mode = this._localStorageWrapperService.getCookies("theme");
    }else{
      mode = "dark";
    }
    if(mode === "light"){
      this.setTheme("dark");
    }else{
      this.setTheme("light")
    }
  }

  setDeviceId(id) {
    this.deviceId = id;
    this.spitOut_1();
    this.spitOut_2();
  }

  getDeviceId() {
    return this.deviceId;
  }

  setUnisearchAutoSuggestData(data) {
    this.unisearchAutoSuggestData = data ? data : null;
  }

  getUnisearchAutoSuggestData() {
    return this.unisearchAutoSuggestData;
  }

  setCookieForLoggedInUser(userObject) {
    const now = new Date();
    const exp = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this._localStorageWrapperService.setCookie(
      "loggedInUser",
      JSON.stringify(userObject),
      exp,
      "/"
    );
  }

  getCookieForLoggedInUser() {
    return this._localStorageWrapperService.getCookies("loggedInUser")
      ? JSON.parse(this._localStorageWrapperService.getCookies("loggedInUser"))
      : null;
  }

  removeCookieForLoggedInUser(userObject) {
    this._localStorageWrapperService.deleteCookie("loggedInUser", "/");
    this.persistDataService.deleteCookieForLoggedInUser();
  }

  getCookieForNonLoggedInUser() {
    return this._localStorageWrapperService.getCookies("nonLoggedInUser")
      ? JSON.parse(this._localStorageWrapperService.getCookies("nonLoggedInUser"))
      : null;
  }

  setCookieForNonLoggedInUser(userObject) {
    const now = new Date();
    const exp = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this._localStorageWrapperService.setCookie(
      "nonLoggedInUser",
      JSON.stringify(userObject),
      exp,
      "/"
    );
  }

  getFeaturedTimstamp() {
    try {
      return this._localStorageWrapperService.getItem("featuredTimestamp");
    } catch (e) {
      this.loggerService.errorLog(ErrorConstants.errors.ERRO2.code, ErrorConstants.errors.ERRO2.title, e.message);
     }
  }

  removeEventsFromCache(eventName) {
    try {
      return this._localStorageWrapperService.removeItem(eventName);
    } catch (e) { 
      this.loggerService.errorLog(ErrorConstants.errors.ERRO2.code, ErrorConstants.errors.ERRO2.title, e.message);
    }
  }

  setEventList(eventName,events) {
    try {
      this._localStorageWrapperService.setItem(eventName, JSON.stringify(events));
    } catch (e) { 
      this.loggerService.errorLog(ErrorConstants.errors.ERRO2.code, ErrorConstants.errors.ERRO2.title, e.message);
    }
  }

  getEventList(eventName) {
    try {
      const jsonStr = this._localStorageWrapperService.getItem(eventName);
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
    } catch (e) { }
  }

  // getErrorList() {
  //   try {
  //     const jsonStr = this._localStorageWrapperService.getItem("errorEvents");
  //     if (jsonStr) {
  //       return JSON.parse(jsonStr);
  //     }
  //   } catch (e) { }
  // }

  // setErrorList(errors) {
  //   try {
  //     console.log("updating errorList")
  //     this._localStorageWrapperService.setItem("errorEvents", JSON.stringify(errors));
  //   } catch (e) { 
  //     this.loggerService.errorLog(ErrorConstants.errors.ERRO2.code, ErrorConstants.errors.ERRO2.title, e.message);
  //   }
  // }
  // removeErrorsInCache() {
  //   try {
  //     console.log("clearing local storage")
  //     return this._localStorageWrapperService.removeItem("errorEvents");
  //   } catch (e) { 
  //     this.loggerService.errorLog(ErrorConstants.errors.ERRO2.code, ErrorConstants.errors.ERRO2.title, e.message);
  //   }
  //}

  // removeSelectedLangsFromCache() {
  //   try {
  //     return this._localStorageWrapperService.removeItem("selectedLangs");
  //   } catch (e) { }
  // }

  // setSelectedLangsInCache(langs) {
  //   try {
  //     this._localStorageWrapperService.setItem("selectedLangs", JSON.stringify(langs));
  //   } catch (e) { }
  // }

  // getSelectedLangsFromCache() {
  //   try {
  //     const jsonStr = this._localStorageWrapperService.getItem("selectedLangs");
  //     if (jsonStr) {
  //       return JSON.parse(jsonStr);
  //     }
  //   } catch (e) { }
  // }

  setUserDetailsObj(obj) {
    this.userDetailsObj = obj;
    this._localStorageWrapperService.setItem("config", JSON.stringify(obj));
    if (obj) {
      this.setEventList("selectedLangs",
        this.userDetailsObj &&
        this.userDetailsObj.profile &&
        this.userDetailsObj.profile.selectedContentLangs
      );
    } else {
      this.removeEventsFromCache("selectedLangs");
    }
  }

  getUserDetailsObj() {
    return this.userDetailsObj;
  }

  setPlaylists(items) {
    this.playlists = items;
  }

  getPlaylists() {
    return this.playlists;
  }

  setPlayerObj(obj) {
    this.playerObj = obj;
  }

  getPlayerObj() {
    return this.playerObj;
  }

  setScreenId(eventType,id) {
    if(eventType === Constants.EVENT_NAME.SCREEN_OPENED){
      this.screenStack.push(id);
      this.screenId = id;
    }
    else if(eventType === Constants.EVENT_NAME.SCREEN_CLOSED){
      this.screenStack.pop();
      this.screenId = this.screenStack[this.screenStack.length-1];
    }
  }

  getScreenId() {
    return this.screenId;
  }

  setUserStateContent(obj) {
    this.userStateContent = obj;
  }

  getUserStateContent() {
    return this.userStateContent;
  }

  getUserAgent() {    
    return window.navigator.userAgent.toLowerCase();
  }

  isLyfPhone() {
    return window.navigator.userAgent.toLowerCase().includes('android 5');
  }

  getAnalyticsUserId() {
    return this._localStorageWrapperService.getCookies("ajs_user_id");
  }

  signHeader(url, method, token, uuid, payload) {
    url = url.replace(
      new RegExp("http://[a-zA-Z0-9\-]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\/"),
      "/"
    );
    url = url.replace(
      new RegExp(
        "http://[a-zA-Z0-9\-]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+:[a-zA-Z0-9]+\\/"
      ),
      "/"
    );
    url = url.replace(
      new RegExp("https://[a-zA-Z0-9\-]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+/"),
      "/"
    );
    const message = payload
      ? method + url + JSON.stringify(payload)
      : method + url;
    if (token && uuid) {
      const hash = CryptoJS.HmacSHA1 ? CryptoJS.HmacSHA1(message, token).toString(
        CryptoJS.enc.Base64
      ) : 'server';
      return uuid + ":" + hash;
    }
  }

  getClientSalt(url) {
    url = url.replace(
      new RegExp("http://[a-zA-Z0-9\-]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\/"),
      "/"
    );
    url = url.replace(
      new RegExp(
        "http://[a-zA-Z0-9\-]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+:[a-zA-Z0-9]+\\/"
      ),
      "/"
    );
    url = url.replace(
      new RegExp("https://[a-zA-Z0-9\-]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+/"),
      "/"
    );
    return CryptoJS.enc.Hex ? CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(url + "51ymYn1MS")) : null;
  }

  isAndroid() {
    var userAgent = this.getUserAgent();
    if (userAgent.indexOf("android") > 1 || userAgent.indexOf("windows") > 1)
      return true;
  }

  // isIOS() {
  //     var userAgent = this.getUserAgent();
  //     return /ipad|iphone|ipod/.test(userAgent) && !$window.MSStream;
  // };

  isDesktop() {
    var ua = navigator.userAgent.toLowerCase();
    return !(
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        ua
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        ua.substr(0, 4)
      )
    );
  }

  isChrome() {
    if (navigator.userAgent.match("CriOS")) return true;
    var browser = this.detectBrowser();
    return browser && browser.toLowerCase().indexOf("chrome") != -1;
  }

  isFirefox() {
    var browser = this.detectBrowser();
    return browser && browser.toLowerCase().indexOf("firefox") != -1;
  }

  isIE() {
    var browser = this.detectBrowser();
    return browser && browser.toLowerCase().indexOf("msie") != -1;
  }

  isMicrosoftEdge() {
    var browser = this.detectBrowser();
    return browser && browser.toLowerCase().indexOf("edge") != -1;
  }

  isSafari() {
    if (navigator.userAgent.match("CriOS")) return false;
    var browser = this.detectBrowser();
    return browser && browser.toLowerCase().indexOf("safari") != -1;
  }

  isUCBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("ucbrowser") != -1 || ua.indexOf("ucweb") != -1) return true;
  }
  isOpera() {
    var opera = navigator.userAgent.match(/Opera|OPR\//) ? true : false;
    return opera;
  }
  isSamsungBrowser() {
    var isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i) ? true : false;
    return isSamsungBrowser;
  }

  isBot(){
    var isBot = navigator.userAgent.match(/(TrendsmapResolver|Fyrebot|Trident|PaperLiBot|LinkedInBot|google|UnwidFetchor|voyager|facebookexternalhit|Facebot|twitterbot|Twitterbot|Whatsapp|developers\.google\.com)/);
    return isBot ? true : false;
  }

  detectBrowser() {
    var ua = navigator.userAgent,
      tem,
      M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return "MSIE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null)
        return tem
          .slice(1)
          .join(" ")
          .replace("OPR", "Opera");
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(" ");
  }

  getBrowserAndVersion() {
    var ua = navigator.userAgent.toLowerCase();
    if (navigator.userAgent.match("CriOS")) return "Chrome";
    else if (ua.indexOf("samsung") != -1)
      return "Samsung Browser";
    else if (ua.indexOf("ucbrowser") != -1 || ua.indexOf("ucweb") != -1)
      return "UC Browser";
    else return this.detectBrowser();
  }

  getOperatingSystem() {
    if (navigator.appVersion.indexOf("Win") != -1) return "Windows";
    else if (navigator.appVersion.indexOf("Macintosh") != -1) return "Mac OS";
    else if (navigator.appVersion.indexOf("Android") != -1) return "Android";
    else if (navigator.appVersion.indexOf("iPhone") != -1 || navigator.appVersion.indexOf("iPad") != -1) return "iOS";
    else if (navigator.appVersion.indexOf("Linux") != -1) return "Linux";
  }
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&"); // This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  generateRandomId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4() +
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
  // hideMobileQueue() {
  //   let ele: HTMLElement = document.getElementById("queueBlock");
  //   if (ele) {
  //     ele.classList.remove("mob-rhs-show");
  //   }
  // }
  getSelectedLanguages() {
    const userObj = this.getUserDetailsObj();
    let langs: any;

    if (userObj && userObj.profile) {
      langs = userObj.profile.selectedContentLangs;
    } else {
      langs = Constants.DEFAULT_LANGUAGES;
    }

    return langs;
  }
  generateAppsFlyerUrl(data, origin, urlUtmSource, viewType, screenId) {
    let bannerTag = "?af_banner=true";
    let media_source = this.getParam("pid", "Website");
    let campaign = this.getParam("c", this.getCampaign(data.type, origin, viewType, screenId));
    let af_dp = this.getParam("af_dp", data.shortUrl);
    let af_dp_web = this.getParam("af_web_dp", Constants.PLAY_STORE_URL);
    let utm_source = this.getParam("utm_source", "wynk");
    let utm_medium = this.getParam("utm_medium", "androidapp");
    let utm_campaign = this.getParam("utm_campaign", "webtoappdownloadpush");
    let af_sub1 = urlUtmSource ? this.getParam("af_sub1", urlUtmSource) : '';
    let url =
      "https://" +
      Constants.SUBDOMAIN +
      ".onelink.me/" +
      Constants.ONELINK_ID +
      bannerTag + media_source + campaign + af_dp + af_dp_web + utm_source + utm_campaign + utm_medium + af_sub1;
    return url;
  }
  getParam(label, value) {    
    return value ? "&" + label + "=" + encodeURIComponent(value) : "";
  }
  setSelectMenuFixedStatus(val) {
    this.isSelectMenuFixed = val;
  }
  getCampaign(type, origin, viewType, screenId) {
    let screenID = screenId || 'Others';
    if(screenId=="HellotunesPage"){
      return 'HellotunesWeb';
    } else if(viewType === 'hellotune' || viewType === 'hellotune_header'){
      if(origin === 'Header'){
        return `${screenID}_${viewType}_${origin}`;
      }else
        return `${screenID}_${viewType}`;
    }else if (origin === 'Header') {
      return `${this.getCampaignType(type)}_Download_Header`;
    }
    else if (origin.includes('footer')) {
      return origin;
    }
    else if (viewType === 'Navbar'){
      return origin;
    }
    else {
      return 'Song_Download';
    }
  }

  getCampaignType(type) {
    if (type === 'USERPLAYLIST') {
      return 'Playlist';
    } else {
      return this.titlecasePipe.transform(type);
    }
  }

  scrollToTop() {
    if(!this._localStorageWrapperService.isPlatformServer()) {
      window.scrollTo(0, 0);
    }
  }
  sortByIsCurated(items: any[]) {
    let isCuratedArray = items.filter(item => item.isCurated);
    let isNonCurated = items.filter(item => !item.isCurated);
    return isCuratedArray.concat(isNonCurated);
  }

  stringToTitleCase(str) {
    if(str){
      return this.titlecasePipe.transform(str);
    }
    return str;
  }

  checkForLoggedInAndNonLoggedInUser() {
    return this.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser() ||
      this.getCookieForNonLoggedInUser() || this.persistDataService.getCookiesForNonLoggedInUser();
  }
  checkedForLoginUser() {
    return this.getCookieForLoggedInUser() || this.persistDataService.getCookiesForLoggedInUser();
  }
  checkedForNonLoginUser() {
    return this.getCookieForNonLoggedInUser() || this.persistDataService.getCookiesForNonLoggedInUser();
  }

  getBrowserDetails() {
    var browserDetails = navigator.userAgent.match(/(opera|OPR|ucbrowser|ucweb|edge(?=\/))\/?\s*(\d+)/i);
    var version;
    if (!browserDetails) {
      browserDetails = navigator.userAgent.match(/(opera|OPR|chrome|safari|firefox|msie|trident|SamsungBrowser|ucbrowser|ucweb|edge|crios(?=\/))\/?\s*(\d+)/i);
    }
    if (!browserDetails) {
      return { "browser": "not found", "version": '' };
    }
    if (browserDetails && browserDetails[1] != "UCBrowser" && navigator.userAgent.toLowerCase().includes("version")) {
      version = navigator.userAgent.toLowerCase().match(/(version(?=\/))\/?\s*(\d+)/i)[2];
    } else {
      version = browserDetails[2];
    }
    return { "browser": browserDetails[1].toLowerCase(), "version": version };
  }

  getBrowserName() {
    if (this.BROWSER_DETAILS.browser == 'opr') {
      return 'Opera';
    }
    return this.titlecasePipe.transform(this.BROWSER_DETAILS.browser);
  }

  isAndroidDevice() {
    return navigator.userAgent.match(/Android/i) ? length > 0 : false;
  }

  isIOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? length > 0 : false;
  }

  setSelectAllState(value) {
    setTimeout(() => {
      let el = <any>document.getElementById('selectedAll');
      el ? el.checked = value : '';
    }, 0);
  }

  navigateToRoute(input) {
    if(input.seeAllLink){
      this.router.navigate([input.seeAllLink], {queryParams : input.queryParams});
    }
    else if (input.type == 'USERPLAYLIST' || input.type == 'SHAREDPLAYLIST') {
      this.router.navigate(
        [
          "/music/my-music/my-playlists/" +
          new ReplaceWhiteSpace().transform(input.title).toLowerCase() +
          "/" +
          input.id
        ]
      );

  } else {
      this.router.navigate(
        [
          "/music/" +
          new LowerCasePipe().transform(input.type) +
          "/" +
          new ReplaceWhiteSpace().transform(input.title).toLowerCase() +
          "/" +
          new ReplaceCpIds(this._localStorageWrapperService).transform(input.id, input.title)
        ]
      );
  }
  }
  navigateToMood(input){
    this.router.navigate(
      [
        "/music/list/"+
        new ReplaceWhiteSpace().transform(input.title).toLowerCase() +
        "/" +
        new ReplaceCpIds(this._localStorageWrapperService).transform(input.id, input.title)
      ]
    );
  }

  modifyMobileView() {
    if (window.innerWidth < 768) {
      return true;
    }
  }


  slideLeftRight(ev, id) {
    let el = document.getElementById(id);
    if (innerWidth < 768 && ev.target.scrollLeft > 0) {
      el.classList.remove('left-add-15');
      el.classList.add('left-add-negative-15');
    }
    if (innerWidth < 768 && ev.target.scrollLeft == 0) {
      el.classList.remove('left-add-negative-15');
      el.classList.add('left-add-15');
    }
  }

  scrollRailLeft(id, addMargin) {
    var el = document.getElementById(id);
    el.scrollLeft -= el.offsetWidth - addMargin;
  }

  scrollRailRight(id, addMargin) {
    var el = document.getElementById(id);
    // document.getElementById(id+'_smoothScroll').style.transition = "all 2s ease";
    el.scrollLeft += el.offsetWidth - addMargin;
  }

  setSearchResultSource(val) {
    this.searchResultSource = val;
  }

  storeSearchData(searchData) {
    let storeData = { heading: searchData };
    this.searchDataList = this._localStorageWrapperService.getItem("searchData")
      ? JSON.parse(this._localStorageWrapperService.getItem("searchData"))
      : [];
    let isDuplicate = this.checkSearchData(searchData);
    if (!isDuplicate) {
      this.searchDataList.unshift(storeData);
      this._localStorageWrapperService.setItem("searchData", JSON.stringify(this.searchDataList));
    }
  }

  checkSearchData(value) {
    return this.searchDataList.find(ele => ele.heading == value);
  }

  setCurrentPageUrl() {
    let isPrevPageUrl = this._localStorageWrapperService.getItemSessionStorage('previousPageUrl');
    if (isPrevPageUrl) {
      this.previousPageUrl = isPrevPageUrl;
      this._localStorageWrapperService.setItemSessionStorage('previousPageUrl', this.router.url);
    } else {
      this._localStorageWrapperService.setItemSessionStorage('previousPageUrl', this.router.url);
    }
  }

  getListTime(time) {
    let hour: any;
    let minutes: any;
    if (time >= 3600) {
      hour = Math.floor(time / 3600);
      minutes = Math.floor((time - (hour * 3600)) / 60);
      minutes = (time / 3600) > 1 ? `${minutes}min` : '';
      return `${hour}h ${minutes}`;
    } else {
      minutes = Math.floor((time) / 60);
      minutes = minutes > 9 ? minutes : `0${minutes} `;
      return `${minutes} min`;
    }
  }

  isPwa(){
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  }

  sendPwaAnalyticEvent(label){
    (<any>window).ga('gtag_UA_109342043_1.send', 'event', {
      'eventCategory': 'PWA',
      'eventLabel': label,
      'eventAction': 'Appeared'
    });
  }

  getUrlFeatures(){
    const {href,hostname,pathname,search} =window.location;
    return {url:href, domain:hostname, pagepath:pathname,query:search};
  }

  isOnline(){
    return window.navigator.onLine;
  }

  serviceWorker(){
   return 'serviceWorker' in window.navigator ? true : false;
  }

  appVersion(){
    return environment.APP_VERSION;
  }

  getScreenWidth(){
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
  
  getScreenHeight(){
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }

  removeShimmeringElement(){
    let id = "websiteShimmering";
    let el = document.getElementById(id);
    el ? el.style.display = 'none' : '';
    let css = document.head.querySelector('#shimmer-css');
    this.theme$.subscribe((theme)=>{
      if(theme === "dark") document.body.classList.add(theme);
    })
    css ? document.head.removeChild(css) : '';
    // css? css.remove(): '';
  }

  openPwaPrompt(){
    if(this.pwaPrompt){
      let x = this.pwaPrompt.prompt();
    }
  }

  isFirstSession(){
    let visited = this._localStorageWrapperService.getItemSessionStorage('visited');
    if(!visited){
      this._localStorageWrapperService.setItemSessionStorage('visited', true);
      return true;
    }else
      return false;
  }

  getVariant(exp){
    let variant_id;
    variant_id=(<any>window).EXPERIMENTS[Constants.AB_MAPPING[exp]];
    console.log(variant_id);
    return (!variant_id || variant_id==="undefined")?  '0' : variant_id;
  }

  spitOut_1() {
    const e2 = this.mixIt(this.deviceId.slice(0, this.e2 * 4).replace(/-/g, '')) + '_1';
    this.imgEvent.next({M: e2});
  }

  spitOut_2() {
    const e1 = this.mixIt(this.deviceId.slice(this.e2 * 4, this.e2 * 8).replace(/-/g, '')) + '_2';
    this.imgEvent.next({F: e1});
  }

  mixIt(spit1) {
    let a = spit1.split('');
    let b = this.BK.split('');
    let c = [];
    let j = 0;
    let k = 0;
    for (let i = 0; i < 31; i++) {
      if (i % 2 === 0) {
        c.push(a[j]);
        j++;
      } else {
        c.push(b[k]);
        k++;
      }
    }
    c.push(b.slice(k, b.length - k - 1).join(''));
    k = b.length - k - 1;
    for (let i = 33; i <= 64; i++) {
      if (i % 2 === 0) {
        c.push(a[j]);
        j++;
      } else {
        c.push(b[k]);
        k++;
      }
    }
    return c.join('');
  }

  genBk(): string {
    return btoa(new Date().getTime().toString() + Math.random() * 1000000000);
  }

  bk_1() {
    return this.BK.slice(0, this.BK.length / 2);
  }

  bk_2() {
    return this.BK.slice(this.BK.length / 2);
  }

  setSecHeaders(headers) {
    headers.forEach((i) => {
      if(typeof i === 'string') this.BS += i;
    });
    this.getPic();
  }

  getPic() {
    let pic = [];
    let skip = 0;
    for(let i=0;i<this.BS.length-1;i+=2) {
      let ip_2 = Number(this.BS.charAt(i)) * 10 + Number(this.BS[i + 1]);
      if (ip_2 < 55) {
        if (skip % 2 !== 0) {
          pic.push(String(200 + ip_2));
        } else {
          pic.push(String(100 + ip_2));
        }
        skip++;
      } else {
        pic.push(String(100 + ip_2));
      }
    }
    this.cip = pic.join('.');
  }

  saveRequiredParams(did, tkey, st){
    // this.tfaService.setRequiredParams(did, tkey, st);
  }
}
