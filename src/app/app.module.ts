import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { UploadsService } from './uploads.service';
import { ItemComponent } from './item/item.component';
import { AddComponent } from './add/add.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms'

import { VgCoreModule, VgStreamingModule } from 'ngx-videogular';


@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ItemComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatProgressBarModule,
    VgCoreModule,
    VgStreamingModule,
    MatInputModule,
    MatListModule,
  ],
  providers: [UploadsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
