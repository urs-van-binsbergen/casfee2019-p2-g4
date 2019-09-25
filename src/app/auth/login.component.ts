import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private next: string;

    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => this.next = params.next || '');
    }

    onSubmit() {
        this.authService.login(
            this.loginForm.controls.username.value,
            this.loginForm.controls.password.value
        )
            .then(result => {
                this.router.navigateByUrl(this.next);
            })
            .catch(error => {
                this.loginForm.controls.password.setErrors({ loginError: error });
            });
    }
}
