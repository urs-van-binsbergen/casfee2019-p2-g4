import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private authState: AuthStateService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authState.isLoggedIn$
            .pipe(
                take(1),
                tap(isLoggedIn => {
                    if (!isLoggedIn) {
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
