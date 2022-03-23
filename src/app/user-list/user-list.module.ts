import { UserListComponent } from "./user-list.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserListRoutingModule } from "./user-list-routing.module";
import { IonicModule } from "@ionic/angular";
import { BrowserModule } from "@angular/platform-browser";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AngularMultiSelectModule,
    IonicModule,
    UserListRoutingModule,
  ],
})
export class UserListModule {}
