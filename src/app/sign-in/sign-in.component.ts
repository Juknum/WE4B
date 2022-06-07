import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
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

  get email() { return this.signInForm.get('email'); }
  get password() { return this.signInForm.get('password'); }

  submitForm() {
    console.log(this.signInForm.value);
    this.auth.signIn(this.signInForm.value.email, this.signInForm.value.password);
  }

}

