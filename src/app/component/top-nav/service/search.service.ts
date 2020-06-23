import { Injectable } from '@angular/core';
import { HttpRequestManager } from '../../../http-manager/http-manager.service';
import { environment } from '../../../../environments/environment';
import { Constants } from '../../../constant/constants';

@Injectable()
export class SearchService {

  constructor(private httpRequestManager: HttpRequestManager) { }

  getAutoTrendingResult(langs) {
    return this.httpRequestManager.get(environment.SAPI_URL + "/v3/trendingsearch?&contentLangs=" + langs, '', '', '');
  }
  getAutoSuggestResult(value) {
    return this.httpRequestManager.get(environment.SEARCH_URL + "/v1/suggest?q=" + value, '', '', '');
  }
  getUniSearchData(param,queryParam) {
    return this.httpRequestManager.get(environment.SEARCH_URL + "/v3/unisearch?q=" + param + queryParam + "&row=" + Constants.UNISEARCH_COUNT_FOR_SEARCH , '', '', '')
  }
}