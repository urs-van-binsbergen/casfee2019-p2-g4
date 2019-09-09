import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CAS FEE 2019 Projekt 2 Gruppe 4';

  constructor(private router: Router, private authService: AuthService) {
  }

  onIndexClicked() {
    this.router.navigateByUrl('/index');
  }

  onHelloWorldClicked() {
    this.router.navigateByUrl('/hello-world');
  }

  onStartClicked() {
    this.router.navigateByUrl('');
  }

  onLogoutClicked() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
