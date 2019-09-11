import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    private next: string;
    title: string = 'Login';

    constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private location: Location) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params['next'] || '');
    }

    onLoginClicked(ok: boolean) {
        this.authService.login(ok);
        if (ok) {
            this.router.navigateByUrl(this.next);
        }
        else {
            this.location.back();
        }
    }
}
