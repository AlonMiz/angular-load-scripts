import { Component } from '@angular/core';
import { markup } from 'src/app/markup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {
  title = 'my-app';
  myDynamicMarkup: string;
  constructor() {
    this.myDynamicMarkup = markup;
  }
}
