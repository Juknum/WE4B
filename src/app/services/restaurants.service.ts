import { Injectable } from "@angular/core";
import { AngularFirestore, } from "@angular/fire/compat/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Restaurant, RestaurantRef, Restaurants, RestaurantsRef } from "../interfaces/restaurant.interface";

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
      ...restaurants.map((restaurant) => !restaurant.header || typeof restaurant.header === 'string' ? restaurant.header : getDownloadURL(ref(getStorage(), restaurant.header.path)))
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
    return new Promise<any>((resolve) => this.db.collection<Restaurant>('restaurants').doc(id).valueChanges({ idField: 'id' }).subscribe(resolve))
      .then((restaurant) => this.convertRefToURL([restaurant]))
      .then((restaurants) => restaurants[0] ?? undefined)
  }

  /**
   * Fetch restaurants that have 1 of the given tags
   * @param {String} text search text input
   * @returns {Restaurants|[]} The restaurants that match the searched text (or an empty array if no restaurants match)
   */
  public async getRestaurantsFromLabels(text: string): Promise<Restaurants|[]> {
    return new Promise<RestaurantsRef>((resolve) => this.db.collection<RestaurantRef>('restaurants', ref => ref
      // check if the whole text && the splitted text is contained in the tags
      .where('tags', 'array-contains-any', [text, ...text.split(' ')])
      .orderBy('name', 'asc'))
      .valueChanges({ idField: 'id' }).subscribe(resolve))
      .then(this.convertRefToURL)
  }

  /**
   * Fetch restaurants that have the given author ids in the owner field
   * @param {String} ownerId the author ids to search for
   * @returns {Restaurants|[]} The restaurants that match the searched id (or an empty array if no restaurants match)
   */
  public async getRestaurantFromOwnerId(ownerId: string): Promise<Restaurants|[]> {
    return new Promise<RestaurantsRef>((resolve) => this.db.collection<RestaurantRef>('restaurants', ref => ref
      .where('owner', '==', ownerId))
      .valueChanges({ idField: 'id' }).subscribe(resolve))
      .then(this.convertRefToURL)
  }

  public async createRestaurant(id: string, owner: string): Promise<void> {
    return this.db.collection('restaurants').doc(id).set({ id, owner })
  }

  public async updateRestaurant(params: Partial<Restaurant> & { id: string }): Promise<void> {
    return this.db.collection('restaurants').doc(params.id).update(params)
  }

  public async updateRestaurantPicture(url: string, id: string): Promise<void> {
    return this.db.collection('restaurants').doc(id).update({ header: url })
  }

  public async deleteRestaurant(id: string): Promise<void> {
    return this.db.collection('restaurants').doc(id).delete()
  }
}
