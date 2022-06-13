import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Restaurant, Restaurants } from "./interfaces/restaurant";

@Injectable({ providedIn: 'root' })
export class RestaurantsService {
  constructor(private db: AngularFirestore) {}

  public async getAllRestaurants(): Promise<Restaurants> {
    return new Promise<Restaurants>((resolve) => this.db.collection<Restaurant>('restaurants').valueChanges({ idField: 'id' }).subscribe(resolve));
  }

  public async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return new Promise<Restaurant | undefined>((resolve) => this.db.collection<Restaurant>('restaurants').doc(id).valueChanges({ idField: 'id' }).subscribe(resolve));
  }
}
