import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  private loggedIn: boolean = false;

  get isLoggedIn() {
    return this.loggedIn;
  }

  login(ok: boolean) {
    this.loggedIn = ok;
  }

  logout() {
    this.loggedIn = false;
  }
}
