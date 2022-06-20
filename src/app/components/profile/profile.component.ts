import { Component, createPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUpload } from 'src/app/models/file-upload.model';
import { User } from 'src/app/interfaces/user.interface';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private user!: User;
  selectedFiles?: FileList;
  currentFileUpload!: FileUpload;
  percentage: number = 0;
  updateUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private fileUploadService: FileUploadService,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    this.updateUserForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(32)]],
      last_name: ['', [Validators.required, Validators.maxLength(32)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
    })

    this.user = await this.userService.getUserFromAuthId(this.route.snapshot.paramMap.get('id')!);

    this.updateUserForm.patchValue({
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      age: this.user.age,
    })
  }

  isFormValid(): boolean {
    return this.updateUserForm.valid;
  }

  get userInfo(): User {
    return this.user ?? null;
  }

  get firstName() { return this.updateUserForm?.get('first_name'); }
  get lastName() { return this.updateUserForm?.get('last_name'); }
  get age() { return this.updateUserForm?.get('age'); }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        // called once the file has been uploaded
        const callback = () => {
          this.userService.updateUserPicture(this.currentFileUpload.url, this.user.id);
        }

        // called every time the upload progress changes
        this.currentFileUpload = new FileUpload(file);
        this.fileUploadService.setBasePath('users/' + this.user.id);
        this.fileUploadService.pushFileToStorage(this.currentFileUpload, callback)
          .subscribe({
            next: (percentage: number | undefined) => this.percentage = Math.round(percentage ?? 0),
            error: (error: Error) => console.error(error),
          });
      }
    }
  }

  submitForm() {
    const validObject: Partial<User> & { id: string } = { id: this.user.id };
    Object.keys(this.user).forEach((key: string) => {
      // @ts-ignore
      if (this.user[key]) validObject[key] = this.user[key];
    })

    this.userService.updateUser({
      ...validObject,
      first_name: this.updateUserForm.value.first_name,
      last_name: this.updateUserForm.value.last_name,
      age: this.updateUserForm.value.age,
    });
  }

}
