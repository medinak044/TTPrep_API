import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectFormModalComponent } from './components/project-form-modal/project-form-modal.component';
import { ProjectComponent } from './pages/project/project.component';
import { ChapterFormModalComponent } from './components/chapter-form-modal/chapter-form-modal.component';
import { TextblockFormModalComponent } from './components/textblock-block/textblock-form-modal.component';
import { SpeakersComponent } from './pages/speakers/speakers.component';
import { SpeakerFormModalComponent } from './components/speaker-form-modal/speaker-form-modal.component';
import { TextBlockLabelComponent } from './pages/text-block-label/text-block-label.component';
import { TextblocklabelFormModalComponent } from './components/textblocklabel-form-modal/textblocklabel-form-modal.component';
import { WordsComponent } from './pages/words/words.component';
import { WordFormModalComponent } from './components/word-form-modal/word-form-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    ProjectsComponent,
    ProjectFormModalComponent,
    ProjectComponent,
    ChapterFormModalComponent,
    TextblockFormModalComponent,
    SpeakersComponent,
    SpeakerFormModalComponent,
    TextBlockLabelComponent,
    TextblocklabelFormModalComponent,
    WordsComponent,
    WordFormModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Allows this client app to perform HTTP requests
    FormsModule, // ngModel
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
