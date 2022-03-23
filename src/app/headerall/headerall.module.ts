import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HeaderallPageRoutingModule } from "./headerall-routing.module";

import { HeaderallPage } from "./headerall.page";
import { SidebarnewPageModule } from "../sidebarnew/sidebarnew.module";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CommonPipeModule } from "../commonPipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HeaderallPageRoutingModule,
    SidebarnewPageModule,
    GooglePlaceModule,
    CommonPipeModule,
    IonicModule,
    SidebarnewPageModule,
  ],
  declarations: [HeaderallPage],
  exports: [HeaderallPage],
})
export class HeaderallPageModule {}
