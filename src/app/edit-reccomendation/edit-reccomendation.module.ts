import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EditReccomendationPageRoutingModule } from "./edit-reccomendation-routing.module";

import { EditReccomendationPage } from "./edit-reccomendation.page";
import { TagInputModule } from "ngx-chips";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TagInputModule,
    EditReccomendationPageRoutingModule,
  ],
  declarations: [EditReccomendationPage],
})
export class EditReccomendationPageModule {}
