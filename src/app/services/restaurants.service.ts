import { Injectable } from "@angular/core";
import { AngularFirestore, CollectionReference, Query } from "@angular/fire/compat/firestore";
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { Restaurant, RestaurantRef, Restaurants, RestaurantsRef } from "./interfaces/restaurant";

@Injectable({ providedIn: 'root' })
export class RestaurantsService {

  constructor(private db: AngularFirestore) {}

  /**
   * Convert the Ref object given by Firebase (that's how they link the data to the database) to the URL of the image
   * @param {RestaurantsRef} restaurants The restaurants to convert
   * @returns {Restaurants} The restaurants with the URL of the image
   */
  private async convertRefToURL(restaurants: RestaurantsRef): Promise<Restaurants> {
    return Promise.all([
      restaurants,
      ...restaurants.map((restaurant) => getDownloadURL(ref(getStorage(), restaurant.header.path)))
    ])
    .then((results) => {
      return results[0].map((restaurant, index) => ({ ...restaurant, header: results[index + 1] }) as Restaurant)
    })
  }

  /**
   * Fetch all restaurants
   * @returns {Restaurants|[]} The restaurants that match the search text (or an empty array if no restaurants exists)
   */
  public async getAllRestaurants(): Promise<Restaurants|[]> {
    return new Promise<RestaurantsRef>((resolve) => this.db.collection<RestaurantRef>('restaurants').valueChanges({ idField: 'id' }).subscribe(resolve))
      .then(this.convertRefToURL)
  }

  /**
   * Fetch a restaurant by its id
   * @param {String} id The Firebase id of the restaurant to get
   * @returns {Restaurant|undefined} The restaurant with the given id, or undefined if it doesn't exist
   */
  public async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return new Promise<Restaurant | undefined>((resolve) => this.db.collection<Restaurant>('restaurants').doc(id).valueChanges({ idField: 'id' }).subscribe(resolve));
  }

  /**
   * Fetch restaurants that have 1 of the given tags
   * @param {String} text search text input
   * @returns {Restaurants|[]} The restaurants that match the search text (or an empty array if no restaurants match)
   */
  public async getRestaurantsWithText(text: string): Promise<Restaurants|[]> {
    return new Promise<RestaurantsRef>((resolve) => this.db.collection<RestaurantRef>('restaurants', ref => ref
      // check if the whole text && the splitted text is contained in the tags
      .where('tags', 'array-contains-any', [text, ...text.split(' ')]))
      .valueChanges({ idField: 'id' }).subscribe(resolve))
      .then(this.convertRefToURL)
  }
}
