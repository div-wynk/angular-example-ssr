import { ReplaceWhiteSpace } from './replace-whitespace.pipe';

describe('ReplaceWhiteSpcae', ()=>{
    let pipe: ReplaceWhiteSpace;

    beforeEach(() => {
        pipe = new ReplaceWhiteSpace();
    })

    it('should create the instance', () => {
        expect(pipe).toBeTruthy();
    })

    it('with two hyphen', () => {
        expect(pipe.transform('test--test')).toBe('test-test');
    })

    it('with space', () => {
        expect(pipe.transform('test test')).toBe('test-test');
    })

    it('with extra space in beginning and end', () => {
        expect(pipe.transform('  test    ')).toBe('test');
    })

    it('with special characters', () => {
        expect(pipe.transform('test*@te!s$t')).toBe('testtest');
    })

    it('only special characters', () => {
        expect(pipe.transform('#$*@()!')).toBe('-');
    })

    it('with special characters and hypens', () => {
        expect(pipe.transform('#$*test@--()test!')).toBe('test-test');
    })
})