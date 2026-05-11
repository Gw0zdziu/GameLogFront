import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ProgressSpinner} from 'primeng/progressspinner';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-image-game',
  imports: [
    ProgressSpinner,
    NgOptimizedImage
  ],
  templateUrl: './image-game.component.html',
  styleUrl: './image-game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGameComponent {
    readonly imageUrl = input<string>('')
}
