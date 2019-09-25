import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './register.component.html',
    styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {

    private next: string;

    username: string;
    pass1: string;
    pass2: string;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params.next || '');
    }

    async onSubmit() {
        const result = await this.authService.register(this.username, this.pass1);
        if (result) {
            this.router.navigateByUrl(this.next);
        } else {
            alert('?');
        }
    }

}
