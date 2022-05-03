import { Component } from '@angular/core';
import { settings, restaurants_tags } from 'src/data';
import { Search } from './search/search.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private search: Search = { content: "", selected_tags: [] };
  private tags: restaurants_tags[] = settings.restaurants_tags;

  constructor() {}

  public getTags = (): restaurants_tags[] => this.tags;
  public getSearch = (): Search => this.search;
}
