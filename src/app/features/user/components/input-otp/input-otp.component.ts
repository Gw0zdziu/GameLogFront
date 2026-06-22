import {ChangeDetectionStrategy, Component, ElementRef, forwardRef, input, signal, viewChildren} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-otp',
  imports: [],
  templateUrl: './input-otp.component.html',
  styleUrl: './input-otp.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputOtpComponent),
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpComponent implements ControlValueAccessor{
  readonly lengthCharacters = input(4)
  readonly inputsElements = viewChildren<ElementRef>('inputElementOtp')

  readonly value$ = signal<string[]>(Array(this.lengthCharacters()).fill(''))
  readonly disabled = signal<boolean>(false);

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

   protected inputValue($event: Event, item: number): void {
     const value = ($event.target as HTMLInputElement).value;
    if (value.length === 1){
     if (item < this.lengthCharacters() - 1){
        this.inputsElements()[item + 1].nativeElement.focus();
     }
      this.value$()[item] = value;
    }
    const result = this.value$().join('');
    this.onChange(result);
  }

  protected clearInput($event: Event, item: number): void {
    $event.preventDefault();
    if (item > 0){
      this.value$()[item] = '';
      this.inputsElements()[item - 1].nativeElement.focus();
    } else {
      this.value$()[item] = '';
    }
    const result = this.value$().join('');
    this.onChange(result);
  }

  writeValue(value: string): void {
     const newValue = value.slice(0, this.lengthCharacters());
    this.value$.update(x => {
      return x.map((valueElement, index) => {
        return newValue[index] || '';
      })
    })

  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
