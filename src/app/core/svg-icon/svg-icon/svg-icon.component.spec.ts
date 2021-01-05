import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  SecurityContext,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SvgService } from '../svg.service';
import { SvgIconComponent, SVG_ATTRIBUTES } from './svg-icon.component';

describe('SvgIconComponent', () => {
  const svgTag: string = '<svg></svg>';
  const svgSelector: string = 'svg';
  const width = 10;
  const height = 10;
  const fill = 'red';
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let svgService: SvgService;
  let domSanitizer: DomSanitizer;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SvgIconComponent],
        providers: [
          {
            provide: ElementRef,
            useValue: {
              nativeElement: {},
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconComponent);

    component = fixture.componentInstance;
    svgService = TestBed.inject(SvgService);
    domSanitizer = TestBed.inject(DomSanitizer);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit() - initializing the component', () => {
    describe('if the src is a svg', () => {
      beforeEach(() => {
        spyOn(svgService, 'getIconByPath').and.returnValue(of(svgTag));
        component.src = 'mySvg.svg';
        fixture.detectChanges();
        component.ngOnInit();
      });

      it('should display the icon in the HTML', () => {
        const secureSvg: SafeHtml = domSanitizer.bypassSecurityTrustHtml(
          svgTag
        );
        const sanitizedSvg: string = domSanitizer.sanitize(
          SecurityContext.HTML,
          secureSvg
        );
        const innerHTML: HTMLElement =
          fixture.elementRef.nativeElement.innerHTML;
        spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.callThrough();
        spyOn(domSanitizer, 'sanitize');

        component.ngOnInit();

        expect(svgService.getIconByPath).toHaveBeenCalledWith(component.src);
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(
          svgTag
        );
        expect(domSanitizer.sanitize).toHaveBeenCalledWith(
          SecurityContext.HTML,
          secureSvg
        );
        expect(innerHTML).toBe(sanitizedSvg);
      });

      describe('when we receive custom attributes...', () => {
        it('should set the whole custom style attributes', () => {
          component.width = width;
          component.height = height;
          component.fill = fill;

          fixture.detectChanges();
          component.ngOnInit();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(
            svgSelector
          );

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.WIDTH)).toBe(
            `${width}px`
          );
          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.HEIGHT)).toBe(
            `${height}px`
          );
          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.FILL)).toBe(fill);
        });

        it('should apply the custom width', () => {
          component.width = 50;

          fixture.detectChanges();
          component.ngOnInit();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(
            svgSelector
          );

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.WIDTH)).toBe('50px');
        });

        it('should apply the custom height', () => {
          component.height = 350;

          fixture.detectChanges();
          component.ngOnInit();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(
            svgSelector
          );

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.HEIGHT)).toBe('350px');
        });

        it('should apply the custom fill', () => {
          const customFillColor = 'pink';
          component.fill = customFillColor;

          fixture.detectChanges();
          component.ngOnInit();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(
            svgSelector
          );

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.FILL)).toEqual(
            customFillColor
          );
        });
      });
    });

    describe('if the src is not a svg', () => {
      it('should not display the icon in the HTML', () => {
        const innerHTML: HTMLElement =
          fixture.elementRef.nativeElement.innerHTML;
        component.src = 'myPhoto.png';
        spyOn(svgService, 'getIconByPath');

        fixture.detectChanges();
        component.ngOnInit();

        expect(svgService.getIconByPath).not.toHaveBeenCalled();
        expect(innerHTML).toBe('');
      });
    });
  });
});
