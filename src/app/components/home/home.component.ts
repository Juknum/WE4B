import { Component, OnInit } from '@angular/core';
import { Restaurant, Restaurants } from 'src/app/services/interfaces/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private restaurants!: any | null;

  constructor(private db: RestaurantsService) { }

  async ngOnInit(): Promise<void> {
    this.restaurants = await this.db.getAllRestaurants();
    console.log(this.restaurants)
  }

  get restaurantsList(): Restaurant[] {
    return this.restaurants;
  }

}
