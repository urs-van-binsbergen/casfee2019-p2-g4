import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.afAuth.authState
            .pipe(
                take(1),
                map(authState => !!authState),
                tap(auth => {
                    if (!auth) {
                        this.router.navigate(['/login'], {
                            queryParams: {
                                next: state.url
                            }
                        });
                    }
                })
            );
    }
}
