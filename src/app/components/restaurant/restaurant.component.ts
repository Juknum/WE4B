import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from 'src/app/interfaces/restaurant.interface';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  private restaurant!: Restaurant | undefined;
  private restaurantOwner!: User | undefined;

  constructor(
    private restaurantsService: RestaurantsService,
    private usersService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  /**
   * Fetch the restaurant information & the restaurant owner information
   */
  async ngOnInit(): Promise<void> {
    this.restaurant = await this.restaurantsService.getRestaurant(this.route.snapshot.paramMap.get('id')!);
    this.restaurantOwner = await this.usersService.getUserFromAuthId(this.restaurant?.owner as string)
  }

  isOwner(): boolean {
    return this.authService.isLoggedIn() && this.restaurantOwner?.auth === this.authService.userId;
  }

  getLink() {
    if (this.restaurant?.coordinates.latitude !== 0 && this.restaurant?.coordinates.longitude !== 0) return `https://www.google.com/maps/@${this.restaurant?.coordinates.latitude},${this.restaurant?.coordinates.longitude},21z`
    else return null;
  }

  hasLink() {
    return this.getLink() !== null;
  }

  get restaurantInfo(): Restaurant | null {
    return this.restaurant ?? null;
  }

  get restaurantOwnerInfo(): User | null {
    return this.restaurantOwner ?? null;
  }

  /**
   * Prettier the phone string into a readable format
   */
  get restaurantPhone(): string | null {
    const index = this.restaurant?.phone || '';
    const cleaned = ('' + index).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);

    if (match) {
      let intlCode = match[1] ? '+33' : ''
      return [intlCode, match[2], match[3], match[4], match[5], match[6]].join(' ');
    }

    return null;
  }

}
