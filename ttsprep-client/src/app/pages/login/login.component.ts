import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginReqDto } from 'src/app/models/loginReqDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  previousUrl!: string
  loginForm: UntypedFormGroup = this.fb.group({
    email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
  })
  get f() { return this.loginForm.controls } // Getter method for displaying error messages
  loginButtonIsPressed: boolean = false
  loginErrorMessage: string = ""

  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private previousRouteService: PreviousRouteService,
  ) { }

  ngOnInit() {
    // If user is already logged in
    if (localStorage.getItem('user')) {
      console.log('login: User is already logged in, redirecting to home page')
      this.router.navigateByUrl('/home')
    }

    this.previousUrl = this.previousRouteService.getPreviousUrl()!
  }

  loginSubmit() {
    this.loginButtonIsPressed = true
    const { email, password } = this.loginForm.value

    let newLoginForm: LoginReqDto = new LoginReqDto()
    newLoginForm.email = email
    newLoginForm.password = password

    this.appUserService.login(newLoginForm)
      .subscribe({
        next: () => {
          // console.log(`Login details: ${user}`)
          this.router.navigateByUrl(this.previousUrl)
        },
        error: (err: any) => {
          this.loginButtonIsPressed = false // Reset the loading visual if unable to connect to api
          this.loginErrorMessage = "Database is waking up, please submit again."
          console.log(err)
        }
      })
  }

  demoFillForm_Admin() {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
      password: ['Password!23', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    })
  }
  demoFillForm_AppUser() {
    this.loginForm = this.fb.group({
      email: ['appuser@example.com', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
      password: ['Password!23', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    })
  }
}
