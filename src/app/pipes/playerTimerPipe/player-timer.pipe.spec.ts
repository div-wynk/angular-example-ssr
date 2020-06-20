import { SecondToMinutes } from './player-timer.pipe';

describe('SecondToMinutes', ()=>{
    let pipe: SecondToMinutes;

    beforeEach(() => {
        pipe = new SecondToMinutes();
    })

    it('should create the instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('when input is less than a minute', () => {
        expect(pipe.transform("50")).toBe("0:50");
    })
    
    it('when input is exact 2 minutes', () => {
        expect(pipe.transform("120")).toBe("2:00");
    })

    it('when input is string with alphabets', () => {
        expect(pipe.transform("abc")).toBe("00:00");
    })

    it('when input is between 1 to 2 minutes', () => {
        expect(pipe.transform("98")).toBe("1:38");
    })

    it('when input is in form of number', () => {
        expect(pipe.transform(98)).toBe("1:38");
    })

    it('when input is zero in string', () => {
        expect(pipe.transform("0")).toBe("0:00");
    })
})