import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { SvgService } from '../svg.service';

export enum SVG_ATTRIBUTES {
  WIDTH = 'width',
  HEIGHT = 'height',
  FILL = 'fill',
  DISPLAY = 'display',
}
@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
export class SvgIconComponent implements OnInit {
  @Input() src: string;
  @Input() fill: string;
  @Input() width: number;
  @Input() height: number;

  constructor(
    private svgService: SvgService,
    private sanitizer: DomSanitizer,
    private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.getIcon();
  }

  private getIcon(): void {
    if (this.hasSvgExtension) {
      this.svgService
        .getIconByPath(this.src)
        .pipe(take(1))
        .subscribe((svg: string) => {
          const svgElement = this.sanitizer.bypassSecurityTrustHtml(svg);
          this.element.nativeElement.innerHTML = this.sanitizer.sanitize(
            SecurityContext.HTML,
            svgElement
          );

          this.handleGenericAttributes();
          this.handleCustomAttributes();
        });
    }
  }

  private handleGenericAttributes(): void {
    this.setAttribute(SVG_ATTRIBUTES.DISPLAY, 'flex');
  }

  private handleCustomAttributes(): void {
    if (this.width) {
      this.setAttribute(SVG_ATTRIBUTES.WIDTH, `${this.width}px`);
    }

    if (this.height) {
      this.setAttribute(SVG_ATTRIBUTES.HEIGHT, `${this.height}px`);
    }

    if (this.fill) {
      this.setAttribute(SVG_ATTRIBUTES.FILL, this.fill);
    }
  }

  private setAttribute(attribute: SVG_ATTRIBUTES, value: string): void {
    this.element.nativeElement?.firstElementChild?.setAttribute(
      attribute,
      value
    );
  }

  get hasSvgExtension(): boolean {
    return /\.(svg)$/i.test(this.src);
  }
}
