/**
 * Created by Harish Chandra
 */
import { Pipe, PipeTransform } from "@angular/core";
import { Constants } from "../../constant/constants";
import { CommonService } from "../../shared/services/common.service";
@Pipe({ name: "customImageSize" })
export class ImagePipe implements PipeTransform {
  constructor(private _commonService: CommonService) {
  }
  transform(url, args: string): any {
    return this.getImageUrl(url, args);
  }
  getImageUrl(url: string, type) {
    const size = type && Constants.IMAGE_QUALITY[type].size;
      let format=this.getFormatSupported();
    if (!url) {
      return;
    }
    if (!(url.includes("img.wynk.in"))) {
      url = Constants.IMG_URL + url;
    }
    if (size) {
      const str = url.substring(url.indexOf("unsafe/") + 7);
      const reqString = str.substring(0, str.indexOf("/"));
      url = url.replace(reqString, size);
    }
    url = url.replace("http:/", "https:/");
    const lastIndexCheck = url.lastIndexOf("https");
    return (
      url.substring(0, lastIndexCheck).replace(/^http:\/\//i, "https://") +
      url.substring(lastIndexCheck)
    ).replace("/top", `/filters:no_upscale():format(${format})`);
    // return url.substring(0, lastIndexCheck).
    // replace(/^http:\/\//i, 'https://') + 'filters:no_upscale():format(jpg):strip_icc()/' + url.substring(lastIndexCheck);
  }
  getFormatSupported() {
    let browserDetails = this._commonService.BROWSER_DETAILS;
    let os = this._commonService.getOperatingSystem();    
    if(browserDetails.browser === "not found" || os==='iOS'){
      return "jpg";
    }
    let minVersionSupported = Constants.BROWSER_WEBP_SUPPORT[browserDetails.browser].minVersion;
    let format="";
      if(browserDetails&&(+browserDetails.version >= +minVersionSupported)){
        format="webp";
       } else{
              format="jpg";
        }
//OLD working code
  //   let browserFormat = this._commonService.browserType;
  //   let format="";
  // if(browserFormat&&(browserFormat.includes('Chrome')||browserFormat.includes('Opera'))||this._commonService.isUcBrowser||this._commonService.isSamsung){
  //  format="webp";
  // }
  // else{
  //   format="jpg";
  // }
   return format;
}
}
