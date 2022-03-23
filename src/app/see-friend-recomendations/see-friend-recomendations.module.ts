import { SidebarnewPageModule } from "./../sidebarnew/sidebarnew.module";
import { SeeFriendRecomendationsComponent } from "./see-friend-recomendations.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeeFriendRecomendationsRoutingModule } from "./see-friend-recomendations-routing.module";
import { YouTubePlayerModule } from "@angular/youtube-player";
import { IonicModule } from "@ionic/angular";
import { CommonPipeModule } from "../commonPipe.module";

@NgModule({
  declarations: [SeeFriendRecomendationsComponent],
  imports: [
    CommonModule,
    YouTubePlayerModule,
    IonicModule,
    CommonPipeModule,
    FormsModule,
    ReactiveFormsModule,
    SeeFriendRecomendationsRoutingModule,
    SidebarnewPageModule,
  ],
  exports: [CommonPipeModule],
})
export class SeeFriendRecomendationsModule {}
