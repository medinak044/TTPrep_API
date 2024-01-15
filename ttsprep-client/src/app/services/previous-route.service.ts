import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  // doc: https://dev.to/slk5611/how-to-access-the-previous-route-in-your-angular-app-5db0
  private previousUrl?: string

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previousUrl = events[0].urlAfterRedirects
        // console.log('previous url', this.previousUrl)
      });
  }

  public getPreviousUrl() {
    return this.previousUrl?.toString()
  }
}
