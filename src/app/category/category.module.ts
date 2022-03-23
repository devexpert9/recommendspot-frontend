import { SidebarnewPageModule } from "./../sidebarnew/sidebarnew.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CategoryPageRoutingModule } from "./category-routing.module";
import { CategoryPage } from "./category.page";
import { CommonPipeModule } from "../commonPipe.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPipeModule,
    CategoryPageRoutingModule,
    SidebarnewPageModule,
  ],
  declarations: [CategoryPage],
})
export class CategoryPageModule {}
