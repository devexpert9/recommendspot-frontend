import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddRecommendPageRoutingModule } from "./add-recommend-routing.module";

import { AddRecommendPage } from "./add-recommend.page";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { TagInputModule } from "ngx-chips";
import { SidebarnewPageModule } from "../sidebarnew/sidebarnew.module";
@NgModule({
  imports: [
    CommonModule,
    GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TagInputModule,
    AddRecommendPageRoutingModule,
    SidebarnewPageModule,
  ],
  declarations: [AddRecommendPage],
})
export class AddRecommendPageModule {}
