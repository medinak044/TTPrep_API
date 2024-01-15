import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationReqDto } from 'src/app/models/registrationReqDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  previousUrl!: string
  registerForm: UntypedFormGroup = this.fb.group({
    // userName: ['', Validators.required],
    email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.mustMatch('password', 'confirmPassword')
  })
  get f() { return this.registerForm.controls } // Getter method for displaying error messages
  validationErrors: string[] = []
  registerButtonIsPressed: boolean = false
  registerErrorMessage: string = ""

  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private previousRouteService: PreviousRouteService,
  ) {
  }

  ngOnInit(): void {
    // If user is already logged in
    if (localStorage.getItem('user')) {
      console.log('register: User is already logged in, redirecting to home page')
      this.router.navigateByUrl('/home')
    }

    this.previousUrl = this.previousRouteService.getPreviousUrl()!
  }

  mustMatch(password: any, confirmPassword: any) {
    return (formGroup: UntypedFormGroup) => {
      const passwordControl = formGroup.controls[password]
      const confirmPasswordControl = formGroup.controls[confirmPassword]

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['Mustmatch']) { return }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ MustMatch: true })
      } else {
        confirmPasswordControl.setErrors(null)
      }
    }
  }

  registerSubmit() {
    this.registerButtonIsPressed = true
    const { userName, email, password } = this.registerForm.value

    let newRegisterForm: RegistrationReqDto = new RegistrationReqDto()
    newRegisterForm.userName = userName ?? email
    newRegisterForm.email = email
    newRegisterForm.password = password

    this.appUserService.register(newRegisterForm).subscribe({
      next: (res: any) => { this.router.navigateByUrl(this.previousUrl) },
      error: (err: any) => {
        this.registerButtonIsPressed = false // Reset the loading visual if unable to connect to api
        this.registerErrorMessage = "Unable to connect to server."
        this.validationErrors = err
      }
    })
  }
}
