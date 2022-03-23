import { AllowOverflowDirective } from "./../directives/allow-overflow.directive";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LandingPagePageRoutingModule } from "./landing-page-routing.module";

import { LandingPagePage } from "./landing-page.page";

import { CommonPipeModule } from "../commonPipe.module";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { SidebarnewPageModule } from "../sidebarnew/sidebarnew.module";
import { HeaderallPageModule } from "../headerall/headerall.module";
import { Ng4GeoautocompleteModule } from "ng4-geoautocomplete";
import { AutocompleteLibModule } from "angular-ng-autocomplete";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    CommonPipeModule,
    IonicModule,
    AutocompleteLibModule,
    LandingPagePageRoutingModule,
    SidebarnewPageModule,
    HeaderallPageModule,
    Ng4GeoautocompleteModule,
  ],
  declarations: [LandingPagePage],
  exports: [CommonPipeModule, SidebarnewPageModule, HeaderallPageModule],
})
export class LandingPagePageModule {}
