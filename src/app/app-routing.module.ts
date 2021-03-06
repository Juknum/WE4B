import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { SignUpComponent } from 'src/app/components/sign-up/sign-up.component';
import { SignInComponent } from 'src/app/components/sign-in/sign-in.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { RestaurantEditComponent } from './components/restaurant/restaurant-edit/restaurant-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'restaurant/new', component: RestaurantEditComponent },
  { path: 'restaurant/:id', component: RestaurantComponent },
  { path: 'restaurant/:id/edit', component: RestaurantEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
