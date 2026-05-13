import {FormatDatePipe} from './format-date.pipe';

describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe;
  beforeEach(() => {
    pipe = new FormatDatePipe();
  })

  it('should return only year', () => {
    expect(pipe.transform(new Date())).toBe(new Date().getFullYear().toString());
  });

});
