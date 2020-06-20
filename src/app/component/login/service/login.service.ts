import { Injectable } from '@angular/core';
import { HttpRequestManager } from '../../../http-manager/http-manager.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LoginService {
    constructor(
        private httpRequetManager: HttpRequestManager  ) { }

    getOtp(payload, deviceId, userAgent) {
        let url = '/v2/account/otp';
        return this.httpRequetManager.post(environment.LOGIN_URL + url, '', payload, '', '', '');
    }

    verifyOtp(payload, deviceId, userAgent) {
        let url = '/v2/account';
        return this.httpRequetManager.post(environment.LOGIN_URL + url, '', payload, '', '', '');
    }
}