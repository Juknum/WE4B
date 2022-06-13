import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: [
        '',
        [ Validators.required, Validators.email ]
      ],
      password: [
        '',
        [ Validators.required, Validators.minLength(10), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$') ]
      ]
    })
  }

  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }

  submitForm() {
    console.log(this.signUpForm.value);
    this.auth.signUp(this.signUpForm.value.email, this.signUpForm.value.password);
  }

}
