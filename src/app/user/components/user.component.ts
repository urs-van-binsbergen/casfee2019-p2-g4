import { Component, OnInit } from '@angular/core';
import { AuthStateService } from 'src/app/auth/auth-state.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    get currentUser() {
        return this.authState.currentUser;
    }

    constructor(
        private authState: AuthStateService
    ) {

    }

    ngOnInit() {

    }

}