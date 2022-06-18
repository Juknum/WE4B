import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FirebaseStorage, getStorage, ref, getDownloadURL } from "firebase/storage";
import { User, UsersRef } from "./interfaces/user";

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly storage: FirebaseStorage

  constructor(private db: AngularFirestore) {
    this.storage = getStorage();
  }

  public async getUserFromAuthId(id: string): Promise<User> {
    return new Promise<any>((resolve) => this.db.collection('users', ref => ref.where('auth', '==', id)).valueChanges({ idField: 'id' }).subscribe(resolve))
      .then((users) => users[0]) // get first match
      .then((user) => Promise.all([ user, getDownloadURL(ref(this.storage, user.picture.path))])) // replace ref picture by url picture
      .then((results) => ({ ...results[0], picture: results[1]}) as User) // map it & return it
  }

  public async updateUser(params: Partial<User>): Promise<void> {
    return new Promise((resolve) => this.db.collection('users').doc(params.id).update(params).then(resolve))
  }

  public emptyUser(): User {
    return {
      id: '',
      first_name: '',
      last_name: '',
      picture: '',
      auth: '',
    }
  }
}
