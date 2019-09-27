import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authStateService: AuthStateService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authStateService.afAuth.authState
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
