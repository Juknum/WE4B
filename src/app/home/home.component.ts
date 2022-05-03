import { Component, OnInit } from '@angular/core';
import { settings } from 'src/data';
import { Search } from '../search/search.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  search: Search = { content: "", selected_tags: [] };
  tags: string[] = settings.restaurants_tags;

  constructor() { }

  public getSearch = (): Search => this.search;
  public ngOnInit = (): void => undefined;

}
