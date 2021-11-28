import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  RunScriptsDirective,
  SafeHtmlPipe,
} from 'src/app/load-scripts.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, SafeHtmlPipe, RunScriptsDirective],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
