import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthRedirectService {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        console.log("nönö")
    }

    /*
     * Leitet z.B. nach dem Login weiter zum URL gemäss Query-Parameter 'next'
     */
    redirectToNext(defaultUrl: string) {
        const route = this.route.snapshot.queryParamMap.get('next') || defaultUrl;
        this.router.navigateByUrl(route);
    }

}
