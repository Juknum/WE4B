import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FirebaseStorage, getStorage, ref, getDownloadURL } from "firebase/storage";
import { User } from "../interfaces/user.interface";

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly storage: FirebaseStorage

  constructor(private db: AngularFirestore) {
    this.storage = getStorage();
  }

  public createUser(params: Partial<User> & { auth: string }): Promise<void> {
    return this.db.collection('users').doc(params.auth).set(params)
  }

  public async getUserFromAuthId(id: string): Promise<User> {
    return new Promise<any>((resolve) => this.db.collection('users', ref => ref.where('auth', '==', id)).valueChanges({ idField: 'id' }).subscribe(resolve))
      .then((users) => users[0]) // get first match
      .then((user) => Promise.all([ user, !user.picture || typeof user.picture === 'string' ? user.picture : getDownloadURL(ref(this.storage, user.picture.path))])) // replace ref picture by url picture
      .then((results) => ({ ...results[0], picture: results[1]}) as User) // map it & return it
  }

  public async updateUser(params: Partial<User> & { id: string }): Promise<void> {
    return new Promise((resolve) => this.db.collection('users').doc(params.id).update(params).then(resolve))
  }

  public async updateUserPicture(url: string, id: string): Promise<void> {
    return new Promise((resolve) => this.db.collection('users').doc(id).update({ picture: url }).then(resolve))
  }
}
