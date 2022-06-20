import { CollectionReference } from "@angular/fire/compat/firestore";

export interface WC {
  _lat: number;
  _long: number;
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  id: string;
  address: string;
  cap: string;
  city: string;
  coordinates: WC;
  header: string; // firebase URL
  name: string;
  owner: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  tags: string[]; // tags used for the search bar
}
export interface Restaurants extends Array<Restaurant> {}

export interface RestaurantRef extends Omit<Restaurant, 'header'> {
  header: {
    firestore: any;
    id: string;
    parent: CollectionReference;
    path: string;
  }
}
export interface RestaurantsRef extends Array<RestaurantRef> {}

export interface NewRestaurant extends Omit<Restaurant, 'id'> {}
