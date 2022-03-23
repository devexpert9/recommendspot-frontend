import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HeaderallPage } from "./headerall.page";

const routes: Routes = [
  {
    path: "",
    component: HeaderallPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeaderallPageRoutingModule {}
