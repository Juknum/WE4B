import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { Restaurant, RestaurantRef, Restaurants, RestaurantsRef } from "./interfaces/restaurant";

@Injectable({ providedIn: 'root' })
export class RestaurantsService {
  private readonly storage: FirebaseStorage

  constructor(private db: AngularFirestore) {
    this.storage = getStorage();
  }

  public async getAllRestaurants(): Promise<Restaurants> {
    return new Promise<RestaurantsRef>((resolve) => this.db.collection<RestaurantRef>('restaurants').valueChanges({ idField: 'id' }).subscribe(resolve))
      .then((restaurants) => Promise.all([
        restaurants,
        ...restaurants.map((restaurant) => getDownloadURL(ref(this.storage, restaurant.header.path)))
      ]))
      .then((results) => {
        return results[0].map((restaurant, index) => ({ ...restaurant, header: results[index + 1] }) as Restaurant)
      })
  }

  public async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return new Promise<Restaurant | undefined>((resolve) => this.db.collection<Restaurant>('restaurants').doc(id).valueChanges({ idField: 'id' }).subscribe(resolve));
  }
}
