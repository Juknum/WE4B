import { Component, Input, OnInit } from '@angular/core';
import { restaurants_tags, settings } from "../../data";

export interface Search {
  content: string;
  selected_tags: restaurants_tags[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  readonly tags: restaurants_tags[] = settings.restaurants_tags;
  @Input() search?: Search;

  constructor() { }

  ngOnInit(): void {}

}
