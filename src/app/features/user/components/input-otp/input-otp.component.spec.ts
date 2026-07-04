import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputOtpComponent} from './input-otp.component';

describe('InputOtpComponent', () => {
  let component: InputOtpComponent;
  let fixture: ComponentFixture<InputOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputValue()', () => {
    it('should calls updateValue()', () => {
      const eventMock = {
        target: {
          value: '1'
        }
      } as unknown as Event;
      component.updateValue = jest.fn();
      component.inputValue(eventMock, 0);
      expect(component.updateValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('inputValue()', () => {
    it('should calls updateValue()', () => {
      const eventMock = {
        target: {
          value: '1'
        },
        preventDefault: jest.fn()
      } as unknown as Event;
      component.updateValue = jest.fn();
      component.clearInput(eventMock, 0);
      expect(component.updateValue).toHaveBeenCalledTimes(1);
    });

    it('should clear element in code$ when item is greater than 0', () => {
      component.code$.set(['1','2','3','4'])
      const element = 1
      const eventMock = {
        target: {
          value: '0'
        },
        preventDefault: jest.fn()
      } as unknown as Event;
      component.updateValue = jest.fn();
      component.clearInput(eventMock, 1);
      expect(component.code$()[element]).toEqual('');
    });
  });

  describe('updateValue()', () => {
    it('should update code$ when calls pasteValue method', async () => {
      const eventMock = {
        clipboardData: {
          getData: jest.fn().mockReturnValue('1234')
        }
      } as unknown as ClipboardEvent;
      component.pasteValue(eventMock);

      expect(component.code$()[0]).toEqual('1');
    });

  });

  describe('writeValue()', () => {
    it('should update code$ when calls writeValue method', async () => {
      component.code$.set(['1','2','3','4'])
      component.writeValue('6666');
      expect(component.code$()).toStrictEqual(['6','6','6','6']);
    });
  });

  describe('setDisabledState()', () => {
    it('should change disabled property when call setDisabledState()', () => {
      component.setDisabledState?.(true);
      expect(component.disabled).toBeTruthy();
    });
  });

  describe('registerOnChange()', () => {
    it('should change code$ when call registerOnChange()', () => {
      const eventMock = {
        target: {
          value: '1'
        },
        preventDefault: jest.fn()
      } as unknown as Event;
      const callback = jest.fn();
      component.registerOnChange(callback);
      component.inputValue(eventMock, 0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

  });
});
