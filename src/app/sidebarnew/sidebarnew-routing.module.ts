import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidebarnewPage } from './sidebarnew.page';

const routes: Routes = [
  {
    path: '',
    component: SidebarnewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidebarnewPageRoutingModule {}
