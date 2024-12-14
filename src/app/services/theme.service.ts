import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  setDarkMode(isDark: boolean) {
    this.isDarkMode.next(isDark);
    this.updateThemeClass(isDark); // Actualiza la clase CSS
  }

  private updateThemeClass(isDark: boolean) {
    const className = 'ion-palette-dark';
    document.documentElement.classList.toggle(className, isDark);
  }

  getDarkMode(): boolean {
    return this.isDarkMode.value;
  }
}

