import { SidebarnewPageModule } from "./../sidebarnew/sidebarnew.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FeedbackComponent } from "./feedback.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeedbackRoutingModule } from "./feedback-routing.module";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FeedbackRoutingModule,
    SidebarnewPageModule,
  ],
})
export class FeedbackModule {}
