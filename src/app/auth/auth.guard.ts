import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanLoad, Route, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

    constructor(private afAuth: AngularFireAuth, private router: Router) {
    }

    canLoad(route: Route): boolean | Observable<boolean> {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.checkLogin(state.url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }

    checkLogin(nextUrl: string) {
        return this.afAuth.authState
            .pipe(
                take(1),
                map(authState => !!authState),
                tap(isLoggedIn => {
                    if (!isLoggedIn) {
                        this.router.navigate(['/auth/login'], {
                            queryParams: {
                                next: nextUrl
                            }
                        });
                    }
                })
            );
    }
}
