import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[appAllowOverflow]",
})
export class AllowOverflowDirective {
  constructor(el: ElementRef) {
    let toolbar: HTMLElement = el.nativeElement;
    setTimeout(() => {
      let container: HTMLElement =
        toolbar.shadowRoot.querySelector(".toolbar-container");
      if (container) {
        // (as any) is just to suppress a warning
        (container.style as any).contain = "none";
        container.style.overflow = "visible";
      }
    });
  }
}
