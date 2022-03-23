import { Directive, Input, ElementRef, Renderer2, OnInit } from "@angular/core";
import { DomController } from "@ionic/angular";

@Directive({
  selector: "[myScrollVanish]",
})
export class ScrollVanishDirective implements OnInit {
  @Input("myScrollVanish") scrollArea;

  private hidden: boolean = false;
  private triggerDistance: number = 150;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    this.initStyles();

    this.scrollArea.ionScroll.subscribe((scrollEvent) => {
      let delta = scrollEvent.detail.deltaY;

      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.initStyles();
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement,
        "transition",
        "0.2s linear"
      );
      //this.renderer.setStyle(this.element.nativeElement, "height", "auto");
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "background", "#fff");
      this.renderer.setStyle(this.element.nativeElement, "position", "fixed");
      this.renderer.setStyle(this.element.nativeElement, "padding", "10px");
      this.renderer.setStyle(this.element.nativeElement, "top", "56px");
      this.renderer.setStyle(this.element.nativeElement, "width", "100%");
      this.renderer.setStyle(this.element.nativeElement, "left", "0");
      this.renderer.setStyle(this.element.nativeElement, "right", "0");
      this.renderer.setStyle(this.element.nativeElement, "z-index", "99");
      this.renderer.setStyle(this.element.nativeElement, "display", "flex");
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, "height", "auto");
      this.renderer.setStyle(
        this.element.nativeElement,
        "background",
        "transparent"
      );
      this.renderer.setStyle(this.element.nativeElement, "position", "initial");
      this.renderer.setStyle(this.element.nativeElement, "padding", "0px");
      this.renderer.setStyle(this.element.nativeElement, "z-index", "initial");
      this.renderer.setStyle(this.element.nativeElement, "display", "block");
    });

    this.hidden = false;
  }
}
