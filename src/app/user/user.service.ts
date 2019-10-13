import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

    constructor(private _authService: AuthService) {
    }

    public updateProfile(displayName: string): Promise<void> {
        return this._authService.updateProfile(displayName);
    }

    public updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        return this._authService.updatePassword(oldPassword, newPassword);
    }

}
