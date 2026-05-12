import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  protected currentLang: string;
  protected languages: string[];

  private translate: TranslateService = inject(TranslateService);

  constructor() {
    this.currentLang = this.translate.getCurrentLang() ?? 'en';
    this.languages = [...this.translate.getLangs()];
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.currentLang = language;
  }
}
