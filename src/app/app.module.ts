import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";

import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { RestaurantCardComponent } from './components/restaurant/restaurant-card/restaurant-card.component';
import { RestaurantEditComponent } from './components/restaurant/restaurant-edit/restaurant-edit.component';
import { FallbackImageDirective } from './directives/fallbackImage.directive';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    RestaurantComponent,
    RestaurantCardComponent,
    ProfileComponent,
    HomeComponent,
    SidebarComponent,
    SignInComponent,
    FallbackImageDirective,
    RestaurantEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,

    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,

    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
