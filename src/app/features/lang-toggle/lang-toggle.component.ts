import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LangStoreService} from '../../core/store/lang-store/lang-store.service';

@Component({
  selector: 'app-lang-toggle',
  imports: [
    FormsModule
  ],
  template:`
    <button class="lang-button"  type="button" (click)="toggleLang()">
      <span class="fi fi-{{currentLang()}}"></span>
    </button>
  `,
  styleUrl: './lang-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LangToggleComponent {
  protected langStore = inject(LangStoreService);
  currentLang = this.langStore.language$;

  toggleLang(): void {
    this.langStore.setLanguage('gb')
    document.location.href = `/${this.currentLang()}`;
  }
}
