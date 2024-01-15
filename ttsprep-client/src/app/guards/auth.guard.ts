import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUserService } from '../services/app-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private appUserService: AppUserService,
    private router: Router
  ) { }

  // This method checks the token from localStorage for the 'user' role (jwt token claim)
  canActivate(): boolean {
    // Check if 'user' in localStorage exists
    const user = localStorage.getItem(`user`)
    if (!user) {
      console.log('Access denied, must be logged in')
      this.router.navigateByUrl('/login') // Redirect user to login page
      return false
    }

    // Get token from user JSON string
    let roles: string[] = []
    const roleData = this.appUserService.getDecodedToken(JSON.parse(user).token).role
    // If a jwt token claim was assigned multiple values when created in the api, it's value will be converted into an array of values
    // console.log("auth.guard.ts:", typeof (roleData), roleData)
    if (typeof (roleData) == 'string') {
      roles.push(roleData) // Insert extracted string value into array
    } else {
      roles = [...roleData] // Insert extracted array of string values into array
    }

    if (roles.find((role: string) => role == 'user')) {
      return true
    } else {
      // Assume 'user' was not included in the jwt token 'role' claim
      console.log('Access denied, must be a valid user')
      this.appUserService.logout('/login') // Remove bad user data from localStorage
      return false
    }
  }

  // This logic only checks if 'user' exists in localStorage
  // If user is not authenticated, block private routes
  canActivate_Old(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check if user is logged in
    if (localStorage.getItem('user') != null) {
      return true
    } else {
      console.log('User must be logged in!')
      this.router.navigateByUrl('/login') // Redirect user to login page
      return false
    }
  }

}
