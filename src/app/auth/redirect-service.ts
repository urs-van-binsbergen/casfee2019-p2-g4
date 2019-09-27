import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';

@Injectable()
export class RedirectService {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {

    }

    /*
     * Leitet z.B. nach dem Login weiter zum URL gemäss Query-Parameter 'next'
     */
    redirectToNext(defaultUrl: string) {
        const route = this.route.snapshot.queryParamMap.get('next') || defaultUrl;
        this.router.navigateByUrl(route);
    }

}
