import { CollectionReference } from "@angular/fire/compat/firestore";

export interface User {
  id: string;
  auth: string;
  first_name: string;
  last_name: string;
  picture: string; // image URL
  age: number;
}


export interface UserRef extends Omit<User, 'picture'> {
  picture: {
    firestore: any;
    id: string;
    parent: CollectionReference;
    path: string;
  }
}
export interface UsersRef extends Array<UserRef> {}
