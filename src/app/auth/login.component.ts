import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private next: string;
    title: string = 'Login';
    username: string;
    pass: string;
    loginMessage: string;

    constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private location: Location) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params['next'] || '');
    }

    async onSubmit() {
        const result = await this.authService.login(this.username, this.pass);
        console.log("component got result", result);
        if (result) {
            this.router.navigateByUrl(this.next);
        } else {
            this.loginMessage = "Login failed";
        }
    }
}
