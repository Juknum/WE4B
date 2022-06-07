import firebase from "firebase/compat";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userData!: firebase.User | null;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(user => {
      this.userData = user;
      localStorage.setItem('user', user === null ? 'null' : JSON.stringify(user));
    })
  }

  get userId() {
    return this.userData?.uid;
  }

  async signUp(email: string, password: string) {
    try {
      // TODO: add email verification
      return await this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => this.router.navigate([ '/profile', this.userData?.uid ]));

    } catch (err) {
      return console.error(err);
    }
  }

  async signIn(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => this.router.navigate([ '/profile', this.userData?.uid ]));
    } catch (err) {
      return console.error(err);
    }
  }

  async signOut() {
    try {
      return await this.afAuth.signOut()
      .then(() => this.router.navigate([ '/' ]));
    } catch (err) {
      return console.error(err);
    }
  }

  isLoggedIn() {
    return this.userData !== null;
  }
}


