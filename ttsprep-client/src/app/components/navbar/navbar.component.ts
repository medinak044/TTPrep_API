import { Component, OnInit } from '@angular/core';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  previousUrl!: string

  constructor(
    public appUserService: AppUserService,
    private previousRouteService: PreviousRouteService,
  ) { }

  ngOnInit(): void {
    this.previousUrl = this.previousRouteService.getPreviousUrl()!
  }

  logout() {
    this.appUserService.logout('/')
  }
}
