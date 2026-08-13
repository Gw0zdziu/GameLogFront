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
  readonly inputsElements = viewChildren<ElementRef<HTMLInputElement>>('inputElementOtp')

  readonly code$ = signal<string[]>(Array(this.lengthCharacters()).fill(''))
  readonly disabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  inputValue($event: Event, item: number): void {
     const value = ($event.target as HTMLInputElement).value;
    if (value.length === 1){
       if (item < this.lengthCharacters() - 1){
          this.inputsElements()[item + 1].nativeElement.focus();
       }
       this.code$()[item] = value;
    }
    this.updateValue();
  }

   clearInput($event: Event, item: number): void {
    $event.preventDefault();
    if (item > 0){
      this.code$()[item] = '';
      this.inputsElements()[item - 1].nativeElement.focus();
    } else {
      this.code$()[item] = '';
    }
    this.updateValue();
  }


  pasteValue($event: ClipboardEvent) {
     let clipBoardValue = $event.clipboardData?.getData('text') || '';
     this.code$.update(x => {
       return x.map((_, index) => {
         return clipBoardValue[index]
       })
     })
    this.inputsElements()[this.inputsElements().length - 1].nativeElement.focus();
     this.updateValue();
  }

  updateValue() {
    const result = this.code$().join('');
    this.onChange(result);
  }

  writeValue(value: string): void {
     const newValue = value.slice(0, this.lengthCharacters());
    this.code$.update(x => {
      return x.map((_, index) => {
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
