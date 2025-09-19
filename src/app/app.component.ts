import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  template: `<router-outlet/>`,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'GameLogFront';
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.verify().subscribe();
  }
}
