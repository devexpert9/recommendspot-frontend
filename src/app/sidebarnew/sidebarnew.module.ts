import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SidebarnewPageRoutingModule } from './sidebarnew-routing.module';

import { SidebarnewPage } from './sidebarnew.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SidebarnewPageRoutingModule
  ],
  declarations: [SidebarnewPage],
  exports:[SidebarnewPage]
})
export class SidebarnewPageModule {}
