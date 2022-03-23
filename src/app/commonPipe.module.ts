import { AllowOverflowDirective } from "./directives/allow-overflow.directive";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateAgoPipe } from "./date-ago.pipe";
import { FilterPipe } from "./filter.pipe";
import { ScrollVanishDirective } from "./directives/scroll-vanish.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [
    DateAgoPipe,
    FilterPipe,
    ScrollVanishDirective,
    AllowOverflowDirective,
  ],
  exports: [
    DateAgoPipe,
    FilterPipe,
    ScrollVanishDirective,
    AllowOverflowDirective,
  ],
})
export class CommonPipeModule {}
