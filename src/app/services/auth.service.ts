import firebase from "firebase/compat";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { UsersService } from "./users.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userData?: firebase.User | null;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private usersService: UsersService
  ) {
    this.afAuth.authState.subscribe(user => {
      this.userData = user;
      localStorage.setItem('user', !user ? 'null' : JSON.stringify(user));
    })
  }

  async signUp(email: string, password: string) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => setTimeout(() => {
        this.usersService.createUser({ auth: this.userId as string });
        this.router.navigate([ `/profile/${this.userId}` ]);
      }, 2000))

    } catch (err) {
      return console.error(err);
    }
  }

  async signIn(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => setTimeout(() => {
        this.router.navigate([ `/profile/${this.userId}` ]);
      }, 2000))

    } catch (err) {
      return console.error(err);
    }
  }

  async signOut() {
    try {
      return await this.afAuth.signOut()
      .then(() => this.router.navigate([ '/' ]))
      .then(() => delete this.userData);
    } catch (err) {
      return console.error(err);
    }
  }

  isLoggedIn() {
    return this.userData !== null;
  }

  get userId() {
    return this.userData?.uid;
  }
}


