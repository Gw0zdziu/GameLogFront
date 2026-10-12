import {computed, inject, Injectable, signal} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class IsMobileStoreService {
  private breakPointObserver: BreakpointObserver = inject(BreakpointObserver);
  private isMobile = signal<boolean>(this.breakPointObserver.isMatched(Breakpoints.Handset));
  readonly isMobile$ = computed(() => this.isMobile());

}
