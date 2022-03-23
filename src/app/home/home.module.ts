import { AllowOverflowDirective } from "../directives/allow-overflow.directive";
import { NgxAutocompleteModule } from "ngx-angular-autocomplete";
import { SidebarnewPageModule } from "./../sidebarnew/sidebarnew.module";
import { SidebarnewPage } from "./../sidebarnew/sidebarnew.page";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HomePageRoutingModule } from "./home-routing.module";

import { YouTubePlayerModule } from "@angular/youtube-player";
import { HomePage } from "./home.page";
import { CommonPipeModule } from "../commonPipe.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";

import { AutocompleteLibModule } from "angular-ng-autocomplete";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    YouTubePlayerModule,
    IonicModule,
    CommonPipeModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    NgxAutocompleteModule,
    SidebarnewPageModule,
    Ng4GeoautocompleteModule,
  ],
  declarations: [HomePage],
  exports: [CommonPipeModule, GooglePlaceModule],
})
export class HomePageModule {}
