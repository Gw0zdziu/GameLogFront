import {FormatDatePipe} from './format-date.pipe';

describe('FormatDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FormatDatePipe('pl');
    expect(pipe).toBeTruthy();
  });
});
