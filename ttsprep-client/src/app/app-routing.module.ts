import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { ProjectsComponent } from './pages/projects/projects.component';
import {ProjectComponent} from "./pages/project/project.component";
import {SpeakersComponent} from "./pages/speakers/speakers.component";
import {TextBlockLabelComponent} from "./pages/text-block-label/text-block-label.component";

const routes: Routes = [
  // Default redirect to home page
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Non-public paths
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'projects', component: ProjectsComponent },
      { path: 'project/:projectId', component: ProjectComponent },
      { path: 'speakers/:projectId', component: SpeakersComponent },
      { path: 'textBlockLabel/:projectId/:chapterId', component: TextBlockLabelComponent },
      // { path: 'view-users', component: ViewUsersComponent },
      // { path: 'profile/:userId', component: ProfileComponent },
      // { path: 'edit-user/:userId', component: EditUserComponent },
      // { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
    ]
  },
  // Public paths
  { path: 'home', component: HomeComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }, // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor, multi: true
    },
  ]
})
export class AppRoutingModule { }
