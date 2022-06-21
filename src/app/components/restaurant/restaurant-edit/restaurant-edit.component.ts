import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Restaurant } from 'src/app/interfaces/restaurant.interface';
import { FileUpload } from 'src/app/models/file-upload.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-restaurant-edit',
  templateUrl: './restaurant-edit.component.html',
  styleUrls: ['./restaurant-edit.component.scss']
})
export class RestaurantEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  selectedFiles?: FileList;
  currentFileUpload!: FileUpload;
  percentage: number = 0;
  header: string = '';
  title: string = 'Create a new restaurant';
  tags: string[] = [];
  updateRestaurantForm!: FormGroup;
  restaurant!: Restaurant | undefined;
  restaurantId: string = Date.now().toString();

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private restaurantsService: RestaurantsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.updateRestaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(32)]],
      description: ['', [Validators.required, Validators.maxLength(256)]],
      address: ['', [Validators.required, Validators.maxLength(256)]],
      cap: ['', [Validators.required, Validators.maxLength(32)]],
      city: ['', [Validators.required, Validators.maxLength(32)]],
      latitude: ['', [Validators.maxLength(32)]],
      longitude: ['', [Validators.maxLength(32)]],
      phone: ['', [Validators.maxLength(32)]],
      email: ['', [Validators.maxLength(32)]],
      website: ['', [Validators.maxLength(32)]],
    });

    // you must be logged to edit a restaurant
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([ `/sign-in` ]);
      return;
    }

    // if we are on the 'edit page' the restaurant id isn't null
    // -> otherwise we are on the 'new restaurant' page
    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.title = 'Edit an existing restaurant';
      const restaurant = await this.restaurantsService.getRestaurant(this.route.snapshot.paramMap.get('id') as string);

      // if the editor isn't the person who's logged : redirect to the the create restaurant page
      if (!restaurant || (this.authService.isLoggedIn() && this.authService.userId !== restaurant.owner)) {
        this.router.navigate([ `/restaurant/new` ]);
        return;
      }

      // update values with current
      this.updateRestaurantForm.patchValue({
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        cap: restaurant.cap,
        city: restaurant.city,
        latitude: restaurant.coordinates?.latitude,
        longitude: restaurant.coordinates?.longitude,
        phone: restaurant.phone,
        email: restaurant.email,
        website: restaurant.website,
      })

      this.tags = restaurant.tags || [];
      this.restaurant = restaurant;
      this.restaurantId = restaurant.id;
    }
  }

  isFormValid(): boolean {
    return this.updateRestaurantForm.valid && this.tags.length > 0;
  }

  private async validateRestaurant(): Promise<void> {
    if (!this.restaurant && this.authService.userId) {
      await this.restaurantsService.createRestaurant(this.restaurantId, this.authService.userId);
      this.restaurant = await this.restaurantsService.getRestaurant(this.restaurantId);
    }
  }

  async submitForm(): Promise<void> {
    await this.validateRestaurant();

    this.restaurantsService.updateRestaurant({
      ...this.restaurant, // old values before updated one (if we are on the 'edit page')
      id: this.restaurantId,
      name: this.updateRestaurantForm.value.name,
      description: this.updateRestaurantForm.value.description,
      address: this.updateRestaurantForm.value.address,
      cap: this.updateRestaurantForm.value.cap,
      city: this.updateRestaurantForm.value.city,
      phone: this.updateRestaurantForm.value.phone ?? '',
      email: this.updateRestaurantForm.value.email ?? '',
      website: this.updateRestaurantForm.value.website ?? '',

      coordinates: {
        latitude: this.updateRestaurantForm.value.latitude ?? 0,
        longitude: this.updateRestaurantForm.value.longitude ?? 0,
      },

      tags: this.tags,
    })
    .then(() => this.router.navigate([ `/restaurant/${this.restaurantId}` ]));
  }

  addLabel(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add the label only if the labels doesn't already include it & if it isn't empty
    if (value && !this.tags.includes(value.toLowerCase()))
      this.tags.push(value.toLowerCase());

    // Clear the input value
    event.chipInput!.clear();
  }

  removeLabel(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) this.tags.splice(index, 1);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  async upload(): Promise<void> {
    if (this.selectedFiles) {
      await this.validateRestaurant();

      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        // called once the file has been uploaded
        const callback = () => {
          this.restaurantsService.updateRestaurantPicture(this.currentFileUpload.url, this.restaurantId)
            .then(() => this.router.navigate([ `/restaurant/${this.restaurantId}/edit` ])) // reload page to actualise the profile picture
        }

        // called every time the upload progress changes
        this.currentFileUpload = new FileUpload(file);
        this.fileUploadService.setBasePath('restaurants/' + this.restaurantId);
        this.fileUploadService.pushFileToStorage(this.currentFileUpload, callback)
          .subscribe({
            next: (percentage: number | undefined) => this.percentage = Math.round(percentage ?? 0),
            error: (error: Error) => console.error(error),
          });
      }
    }
  }

  get name() { return this.updateRestaurantForm?.get('name'); }
  get address() { return this.updateRestaurantForm?.get('address'); }
  get cap() { return this.updateRestaurantForm?.get('cap'); }
  get city() { return this.updateRestaurantForm?.get('city'); }

}
