import {Component, input, OnDestroy, output, signal} from '@angular/core';
import {clearInterval} from 'node:timers';

@Component({
  selector: 'app-timer',
  template: `
    <span>{{minutes().toString().length === 1 ? '0' + minutes() : minutes()}} : {{seconds().toString().length === 1 ? '0' + seconds() : seconds()}}</span>
  `,
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnDestroy{
  minutesInput = input<number>(1)
  secondsInput = input<number>(59);
  emitter = output();
  minutes = signal(this.minutesInput());
  seconds = signal(this.secondsInput())
  defaultSeconds = this.seconds();
  interval: NodeJS.Timeout;




  constructor() {
    this.interval = setInterval(() => {
      console.log('tick')
      if (this.minutes() >= 0 && this.seconds() >= 1){
        this.seconds.update(x => x -1);
      } else if (this.seconds() <= 1 && this.minutes() > 0){
        this.seconds.set(this.defaultSeconds);
        this.minutes.update(x => x - 1);
      }else {
        this.emitter.emit()
        clearInterval(this.interval)
      }
    }, 1000)
  }

  ngOnDestroy() {
    clearInterval(this.interval)
  }
}
