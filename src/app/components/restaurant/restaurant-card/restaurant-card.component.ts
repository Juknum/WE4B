import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Restaurant } from 'src/app/interfaces/restaurant';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent implements OnInit {

  @Input()
  restaurant!: Restaurant;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {}

  showEditBtn(id: string): boolean {
    return id === this.auth.userId;
  }

}
