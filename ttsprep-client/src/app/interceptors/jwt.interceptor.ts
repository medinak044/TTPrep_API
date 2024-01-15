import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AppUserService } from '../services/app-user.service';
import { Router } from '@angular/router';
import { LoginResDto } from '../models/loginResDto';

@Injectable() // Implemented in "app-routing.module.ts"
// Attaches authentification info (token) to http requests to access secured routes of the api
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private appUserService: AppUserService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let currentUser!: LoginResDto

        this.appUserService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user)

        // The original request instance is readonly, so assign a modified clone of it instead
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}` // Append token to request copy
                }
            })
            // console.log(request) // Logs response header data
        }

        // Return a modified request, then handle success/errors with .tap()
        return next.handle(request).pipe(
            tap(
                succ => { },
                err => {
                    // if (err.status >= 400 && err.status < 500) {
                    //     this.appUserService.logout() // Get rid current token
                    //     this.router.navigateByUrl('/login') // Redirect to login
                    // }
                    console.log("jtw.interceptor.ts:", err)
                }
            )
        )
    }

}
