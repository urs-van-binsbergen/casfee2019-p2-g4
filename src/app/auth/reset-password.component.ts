import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './reset-password.component.html',
    styleUrls: [ './reset-password.component.scss' ]
})
export class ResetPasswordComponent implements OnInit {

    private next: string;

    email: string;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params.next || '');
    }

    async onSubmit() {
        await this.authService.sendPasswordMail(this.email);
        this.router.navigateByUrl(this.next);
    }

}
