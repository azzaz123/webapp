import { Component, ElementRef, Input, OnChanges, OnInit, SecurityContext, SimpleChange, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { SvgService } from '@core/svg-icon/svg.service';

export enum SVG_ATTRIBUTES {
  WIDTH = 'width',
  HEIGHT = 'height',
  FILL = 'fill',
  DISPLAY = 'display',
}

export enum SVG_SIZE_UNIT {
  PIXELS = 'px',
  PERCENTATGE = '%',
}

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
export class SvgIconComponent implements OnInit, OnChanges {
  @Input() src: string;
  @Input() fill: string;
  @Input() width: number;
  @Input() height: number;
  @Input() sizeUnit: SVG_SIZE_UNIT = SVG_SIZE_UNIT.PIXELS;

  constructor(private svgService: SvgService, private sanitizer: DomSanitizer, private element: ElementRef) {}

  public ngOnInit(): void {
    this.getIcon();
  }

  public ngOnChanges(changes: SimpleChanges) {
    const { src } = changes;
    if (this.hasIconSourceChanged(src)) {
      this.getIcon();
    }
  }

  private getIcon(): void {
    if (this.hasSvgExtension) {
      this.svgService
        .getIconByPath(this.src)
        .pipe(take(1))
        .subscribe((svg: string) => {
          const svgElement = this.sanitizer.bypassSecurityTrustHtml(svg);
          this.element.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, svgElement);

          this.handleGenericAttributes();
          this.handleCustomAttributes();
        });
    }
  }

  private hasIconSourceChanged(srcChange: SimpleChange): boolean {
    return srcChange && !srcChange.firstChange && srcChange.previousValue !== srcChange.currentValue;
  }

  private handleGenericAttributes(): void {
    this.setAttribute(SVG_ATTRIBUTES.DISPLAY, 'flex');
  }

  private handleCustomAttributes(): void {
    if (this.width) {
      this.setAttribute(SVG_ATTRIBUTES.WIDTH, `${this.width}${this.sizeUnit}`);
    }

    if (this.height) {
      this.setAttribute(SVG_ATTRIBUTES.HEIGHT, `${this.height}${this.sizeUnit}`);
    }

    if (this.fill) {
      this.setAttribute(SVG_ATTRIBUTES.FILL, this.fill);
    }
  }

  private setAttribute(attribute: SVG_ATTRIBUTES, value: string): void {
    this.element.nativeElement?.firstElementChild?.setAttribute(attribute, value);
  }

  get hasSvgExtension(): boolean {
    return /\.(svg)$/i.test(this.src);
  }
}
