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
  header: string; // base-64 image
  name: string;
  owner: string;
}

export interface NewRestaurant extends Omit<Restaurant, 'id'> {}
export interface Restaurants extends Array<Restaurant> {}
