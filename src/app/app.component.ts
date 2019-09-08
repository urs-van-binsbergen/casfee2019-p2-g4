import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CAS FEE 2019 Projekt 2 Gruppe 4';

  constructor(private router: Router) {
  }

  onIndexClicked() {
    this.router.navigateByUrl('');
  }

  onHelloWorldClicked() {
    this.router.navigateByUrl('/hello-world');
  }
}
