import { Component, inject } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-toggle-theme',
  templateUrl: './toggle-theme.component.html',
  styleUrls: ['./toggle-theme.component.scss'],
})
export class ToggleThemeComponent {
  themeService = inject(ThemeService)
  paletteToggle = false;

  constructor() {
    this.initDarkMode();
  }

  initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.paletteToggle = prefersDark.matches;
    this.themeService.setDarkMode(this.paletteToggle); // Inicializa el tema

    prefersDark.addEventListener('change', (mediaQuery) => {
      const isDark = mediaQuery.matches;
      this.paletteToggle = isDark;
      this.themeService.setDarkMode(isDark); // Actualiza el estado
    });
  }

  toggleChange(ev: any) {
    this.paletteToggle = ev.detail.checked;
    this.themeService.setDarkMode(this.paletteToggle); // Cambia el tema
  }
}
