import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { map, Observable, startWith } from 'rxjs';
import { settings } from "../../data";

export interface Search {
  content: string;
  selected_tags: Array<string>;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  separatorKeysCodes: Array<number> = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = settings.restaurants_tags.sort();

  @Input() search?: Search;
  @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
    );
  }

  /**
   * Add a tag to the list of selected tags
   * @param {MatChipInputEvent} event
   */
  public add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // add the tag
    if (value) this.tags.push(value);

    // clear the input value
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  /**
   * Remove a tag from the list of selected tags
   * @param {string} tag 
   */
  public remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) this.tags.splice(index, 1);
  }

  /**
   * @param {MatAutocompleteSelectedEvent} event 
   */
  public selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  /**
   * Filter a tag from the list of all tags
   * @param {string} value 
   * @returns {string[]}
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {}

}
