import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/services/interfaces/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private user!: User;
  updateUserForm!: FormGroup;

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.userService.getUserFromAuthId(this.route.snapshot.paramMap.get('id')!);
    this.updateUserForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
    })
  }

  get userInfo(): User {
    return this.user ?? this.userService.emptyUser();
  }

  get firstName() { return this.updateUserForm.get('first_name'); }
  get lastName() { return this.updateUserForm.get('last_name'); }

  submitForm() {
    this.userService.updateUser(this.updateUserForm.value);
  }

}
