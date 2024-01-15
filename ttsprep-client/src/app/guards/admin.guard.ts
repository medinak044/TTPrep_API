import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUserService } from '../services/app-user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(
    private appUserService: AppUserService,
    private router: Router
  ) { }

  // This method checks the token from localStorage for the 'AppUser' role (jwt token claim)
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
    // console.log("admin.guard.ts:", typeof (roleData), roleData)
    if (typeof (roleData) == 'string') {
      roles.push(roleData) // Insert extracted string value into array
    } else {
      roles = [...roleData] // Insert extracted array of string values into array
    }

    if (roles.find((role: string) => role == 'admin')) {
      return true
    } else {
      // Assume 'admin' was not included in the jwt token 'role' claim
      console.log('Access denied, must have "admin" role')
      this.appUserService.logout('/login') // Remove bad user data from localStorage
      return false
    }
  }


  // The problem with this method is that it assumes the user is already logged in, with 'user' data in localStorage
  canActivate_Old(): Observable<boolean> {
    return this.appUserService.currentUser$.pipe(
      map((user: any) => {
        if (user.roles.includes('admin')) {
          return true
        } else {
          console.log('Access denied, must have "admin" role')
          this.appUserService.logout('/login') // Remove bad user data from localStorage
          return false
        }
      })
    )
  }

}
