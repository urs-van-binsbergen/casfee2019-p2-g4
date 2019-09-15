import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private next: string;

    mode = 'login';

    username: string;
    pass: string;
    loginMessage: string;

    constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params.next || '');
    }

    async onSubmit() {
        let result;
        switch (this.mode) {
            case 'register':
                result = await this.authService.register(this.username, this.pass);
                break;
            case 'resetPassword':
                result = await this.authService.sendPasswordMail(this.username);
                break;
            default:
                result = await this.authService.login(this.username, this.pass);
                break;
        }
        console.log('component got result', result);
        if (result) {
            this.router.navigateByUrl(this.next);
        } else {
            this.loginMessage = 'Login failed';
        }
    }

    register() {
        this.mode = 'register';
    }

    resetPassword() {
        this.mode = 'resetPassword';
    }
}
