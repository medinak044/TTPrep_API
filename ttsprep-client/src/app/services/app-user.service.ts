import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUser } from '../models/appUser';
import { AppUserUpdateDto } from '../models/appUserUpdateDto';
import { AppUserRegister } from '../models/appUserRegister';
import { AppUserLogin } from '../models/appUserLogin';
import { AppUserLoggedIn } from '../models/appUserLoggedIn';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private controllerUrl: string = "Account" // AccountController
  private currentUserSource = new ReplaySubject<any>(1); // <AppUserLoggedIn>
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // A test route to see if token interceptor works
  getUserProfile() {
    return this.http.get<AppUser>
      (`${environment.apiUrl}/${this.controllerUrl}/GetUserProfile`)
  }

  getUserById(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>
      (`${environment.apiUrl}/${this.controllerUrl}/GetUserById/${userId}`)
  }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>
      (`${environment.apiUrl}/${this.controllerUrl}/GetAllUsers`)
  }

  updateUser(appUser: AppUserUpdateDto): Observable<AppUserUpdateDto> {
    return this.http.post<AppUserUpdateDto>
      (`${environment.apiUrl}/${this.controllerUrl}/UpdateUser`, appUser)
  }

  deleteUser(userId: string) {
    return this.http.delete
      (`${environment.apiUrl}/${this.controllerUrl}/DeleteUser/${userId}`)
  }

  register(registerForm: AppUserRegister) {
    return this.http.post
      (`${environment.apiUrl}/${this.controllerUrl}/Register`, registerForm).pipe(
        map((user: any) => {
          if (user) {
            this.setCurrentUser(user); // Logs user in, setting 'user' in localStorage
            this.refreshComponents()
          }
        })
      )
  }

  login(loginForm: AppUserLogin) {
    return this.http.post
      (`${environment.apiUrl}/${this.controllerUrl}/Login`, loginForm).pipe(
        map((user: any) => {
          if (user) {
            this.setCurrentUser(user); // Logs user in, setting 'user' in localStorage
            this.refreshComponents()
          }
        })
      )
  }

  setCurrentUser(user: AppUserLoggedIn) {
    user.roles = []
    const roles = this.getDecodedToken(user.token).role // Extract roles from token
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles) // Set found roles in user object
    localStorage.setItem('user', JSON.stringify(user)) // Store user object as a string in localStorage
    this.currentUserSource.next(user) // Reference the user object
  }
  getDecodedToken(token: any) {
    var base64Url = token.split('.')[1]
    var base64 = decodeURIComponent(atob(base64Url).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(base64)
  }

  logout(redirectUrl: string): boolean {
    this.refreshComponents() // Refresh navbar
    console.log(`${(localStorage.getItem('user')) ? "Logout success!" : "Already logged out!"}`)
    // Check if user is already logged out
    if (localStorage.getItem('user') == null) {
      return false
    } else {
      localStorage.removeItem('user') // Remove 'user' object containing token
      this.currentUserSource.next(null) // Clear current logged in user
      this.router.navigateByUrl(redirectUrl ? redirectUrl : '/')
      return true
    }
  }


  refreshComponents() {
    location.reload()

    // // Quickly navigates to the first url, then to the second
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigateByUrl('/')
    // })
  }


  getLocalStorageUser() {
    const userStr: any = localStorage.getItem('user')
    if (userStr) { return JSON.parse(userStr) }
  }
}
