import { Component, Input, OnInit } from '@angular/core';

export interface Error {
  code: number;
  message: string;
}

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
  @Input("error") error?: Error;

  constructor() {}
  ngOnInit(): void {}
}
