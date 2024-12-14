import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserI } from 'src/app/interfaces/user.module';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {
  themeService = inject(ThemeService)
  authService = inject(AuthService);
  router = inject(Router);

  paletteToggle = false;

  currentImage = 'assets/images/light.jpg';

  constructor() {
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.currentImage = isDark
        ? 'assets/images/dark.jpg'
        : 'assets/images/light.jpg';
    });
  }
  
}
