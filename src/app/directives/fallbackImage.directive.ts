import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img[fallbackImage]'
})
export class FallbackImageDirective {
  @Input() fallbackImage?: string;

  constructor(private el: ElementRef) { }

  @HostListener('error')
  onError() {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    element.src = this.fallbackImage || 'assets/images/no-image.png';
  }
}
