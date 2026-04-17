import {ChangeDetectionStrategy, Component, Inject, LOCALE_ID} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Button, ButtonDirective} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {languages} from '../../shared/constants/languages';
import {Ripple} from 'primeng/ripple';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faLanguage, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lang-toggle',
  imports: [
    FormsModule,
    Menu,
    Ripple,
    ButtonDirective,
    FaIconComponent
  ],
  template:`
    <button pButton  type="button"
            [rounded]="true" [text]="true" (click)="langMenu.toggle($event)">
      <fa-icon size="lg" [icon]="faLanguage" />
    </button>
    <p-menu #langMenu [model]="languages" [popup]="true">
      <ng-template #item let-item>
        <button class="lang-button" pRipple type="button" (click)="toggleLang(item.langCode)" >
          <span>{{item.langName}}</span>
        </button>
      </ng-template>
    </p-menu>
  `,
  styleUrl: './lang-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LangToggleComponent {
  languages = languages;
  faLanguage = faLanguage;


  constructor(
    @Inject(LOCALE_ID) public activeLocale: string
  ) {}

  toggleLang(langCode: string): void {
    if (langCode !== this.activeLocale) {
      const currentPath = location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(en|pl)/, '');
      location.href = `/${langCode}${pathWithoutLang}`;
    }
  }
}
