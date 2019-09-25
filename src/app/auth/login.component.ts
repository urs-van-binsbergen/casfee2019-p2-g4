import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private next: string;

    username: string;
    pass: string;
    loginMessage: string;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params.next || '');
    }

    async onSubmit() {
        const result = await this.authService.login(this.username, this.pass);
        if (result) {
            this.router.navigateByUrl(this.next);
        } else {
            this.loginMessage = 'Login failed';
        }
    }

}
