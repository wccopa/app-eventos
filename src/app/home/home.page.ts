import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage {
  themeService = inject(ThemeService)
  currentImage = 'assets/images/light.jpg';

  
  ngOnInit() {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.currentImage = isDark
        ? 'assets/images/dark.jpg'
        : 'assets/images/light.jpg';
    });
  }

  constructor() {}

}
