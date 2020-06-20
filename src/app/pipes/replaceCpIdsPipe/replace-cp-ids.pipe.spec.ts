import { TestBed } from '@angular/core/testing';
import { LocalStorageWrapperService } from '../../shared/services/localstorage-wrapper.service';
import { ReplaceCpIds } from './replace-cp-ids.pipe';
import { Constants } from '../../constant/constants';

describe('replaceCpIds', () => {

    let pipe: ReplaceCpIds;
    let _localStorageWrapperService = new LocalStorageWrapperService(undefined,undefined);

    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [
                    LocalStorageWrapperService
            ] 
        });
        pipe = new ReplaceCpIds(_localStorageWrapperService);
        spyOn(_localStorageWrapperService, 'getItem').and.returnValue(JSON.stringify({cpmapping : Constants.STATIC_CPMAPPING}))
    })

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('Replace cps', () => {
        expect(pipe.transform('srch_bsb_1519636443579',null)).toBe('bb_1519636443579');
    })

    it('Replace cps with comma', () => {
        expect(pipe.transform('srch_bsb_1519636443579,srch_bsb_1519636443579',null)).toBe('bb_1519636443579,bb_1519636443579');
    })

    it('Replace mood cps', () => {
        expect(pipe.transform('srch_bsb_1519636443579_en,srch_bsb_1519636443579_hi',null)).toBe('bb_1519636443579_en,bb_1519636443579_hi');
    })

    it('Replace cps without comma and 3 underscore', () => {
        expect(pipe.transform('srch_bsb_1519636443579_en',null)).toBe('bb_1519636443579_en');
    })

    it('Replace cps without localStorage', () => {
        _localStorageWrapperService.getItem = () => {
            return null;
        }
        expect(pipe.transform('srch_bsb_1519636443579',null)).toBe('bb_1519636443579');
    })

    it('if cp is not present', () => {
        expect(pipe.transform('src_bsb_1519636443579',null)).toBe('src_bsb_1519636443579');
    })
})