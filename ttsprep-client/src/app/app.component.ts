import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppUserService } from './services/app-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TTSPrep';

  constructor(private appUserService: AppUserService) { }

  ngOnInit() {
    this.setCurrentUser() // Makes sure currentUser$ variable constantly has a value every time a route is accessed (opening browser, clicking routerLink)
  }

  setCurrentUser() {
    // Get the user(string) data from user browser's localStorage and convert to a user object
    const userStr = localStorage.getItem('user') // Get 'user' JSON string
    let user = null
    if (userStr) { user = JSON.parse(userStr) } // Parse JSON string into object
    if (user) { this.appUserService.setCurrentUser(user) }
  }
}
