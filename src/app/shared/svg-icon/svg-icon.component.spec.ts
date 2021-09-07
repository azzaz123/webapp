import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ElementRef, Input, SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SvgService } from '@core/svg-icon/svg.service';
import { SvgIconComponent, SVG_ATTRIBUTES, SVG_SIZE_UNIT } from './svg-icon.component';

@Component({
  selector: 'tsl-test-component',
  template: `<tsl-svg-icon [fill]="fill" [height]="height" [src]="src" [width]="width" [sizeUnit]="sizeUnit"></tsl-svg-icon>`,
})
class TestComponent {
  @Input() src: string;
  @Input() fill: string;
  @Input() width: number;
  @Input() height: number;
  @Input() sizeUnit: SVG_SIZE_UNIT = SVG_SIZE_UNIT.PIXELS;
}

describe('SvgIconComponent', () => {
  const svgTag = '<svg display="flex"></svg>';
  const svgSelector = 'svg';
  const width = 10;
  const height = 10;
  const fill = 'red';
  const defaultSizeUnit: SVG_SIZE_UNIT = SVG_SIZE_UNIT.PIXELS;
  let testComponent: TestComponent;
  let component: SvgIconComponent;
  let debugElement: DebugElement;
  let componentDebugElement: DebugElement;
  let fixture: ComponentFixture<TestComponent>;
  let svgService: SvgService;
  let domSanitizer: DomSanitizer;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TestComponent, SvgIconComponent],
        providers: [
          {
            provide: ElementRef,
            useValue: {
              nativeElement: {},
            },
          },
          SvgService,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    svgService = TestBed.inject(SvgService);
    domSanitizer = TestBed.inject(DomSanitizer);

    testComponent = fixture.componentInstance;
    debugElement = fixture.debugElement;
    componentDebugElement = debugElement.query(By.directive(SvgIconComponent));
    component = componentDebugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit() - initializing the component', () => {
    describe('if the src is a svg', () => {
      beforeEach(() => {
        spyOn(svgService, 'getIconByPath').and.returnValue(of(svgTag));
        testComponent.src = 'mySvg.svg';
      });

      it('should display the icon in the HTML', () => {
        const secureSvg: SafeHtml = domSanitizer.bypassSecurityTrustHtml(svgTag);
        const sanitizedSvg: string = domSanitizer.sanitize(SecurityContext.HTML, secureSvg);
        spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.callThrough();
        spyOn(domSanitizer, 'sanitize').and.callThrough();

        fixture.detectChanges();

        expect(svgService.getIconByPath).toHaveBeenCalledWith(component.src);
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(svgTag);
        expect(domSanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, secureSvg);
        expect(componentDebugElement.nativeElement.innerHTML).toBe(sanitizedSvg);
      });

      describe('when we receive custom attributes...', () => {
        it('should set the whole custom style attributes', () => {
          testComponent.width = width;
          testComponent.height = height;
          testComponent.fill = fill;

          fixture.detectChanges();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(svgSelector);

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.WIDTH)).toBe(`${width}${defaultSizeUnit}`);
          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.HEIGHT)).toBe(`${height}${defaultSizeUnit}`);
          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.FILL)).toBe(fill);
        });

        it('should apply the custom width', () => {
          testComponent.width = 50;

          fixture.detectChanges();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(svgSelector);

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.WIDTH)).toBe('50px');
        });

        it('should apply the custom height', () => {
          testComponent.height = 350;

          fixture.detectChanges();
          const innerHTML: HTMLElement = debugElement.nativeElement.querySelector(svgSelector);

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.HEIGHT)).toBe('350px');
        });

        it('should apply the custom fill', () => {
          const customFillColor = 'pink';
          testComponent.fill = customFillColor;

          fixture.detectChanges();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(svgSelector);

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.FILL)).toEqual(customFillColor);
        });

        it('should apply custom size unit', () => {
          const customSizeUnit = SVG_SIZE_UNIT.PERCENTATGE;
          testComponent.width = width;
          testComponent.height = height;
          testComponent.sizeUnit = customSizeUnit;

          fixture.detectChanges();
          const innerHTML: HTMLElement = fixture.debugElement.nativeElement.querySelector(svgSelector);

          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.WIDTH)).toBe(`${width}${customSizeUnit}`);
          expect(innerHTML.getAttribute(SVG_ATTRIBUTES.HEIGHT)).toBe(`${height}${customSizeUnit}`);
        });
      });
    });

    describe('if the src is not a svg', () => {
      it('should not display the icon in the HTML', () => {
        const innerHTML: HTMLElement = componentDebugElement.nativeElement.innerHTML;
        testComponent.src = 'myPhoto.png';
        spyOn(svgService, 'getIconByPath');

        fixture.detectChanges();

        expect(svgService.getIconByPath).not.toHaveBeenCalled();
        expect(innerHTML).toBe('');
      });
    });
  });

  describe('when source changes from parent after init', () => {
    beforeEach(() => {
      testComponent.src = 'mySvg.svg';
      fixture.detectChanges();
    });
    describe('and icon is different', () => {
      it('should reload the icon', () => {
        spyOn(svgService, 'getIconByPath').and.returnValue(of(''));

        testComponent.src = 'myOtherSvg.svg';
        fixture.detectChanges();

        expect(svgService.getIconByPath).toHaveBeenCalledTimes(1);
        expect(svgService.getIconByPath).toHaveBeenCalledWith('myOtherSvg.svg');
      });
    });

    describe('and icon is the same', () => {
      it('should not reload the icon', () => {
        spyOn(svgService, 'getIconByPath');

        testComponent.src = 'mySvg.svg';
        fixture.detectChanges();

        expect(svgService.getIconByPath).not.toHaveBeenCalled();
      });
    });
  });
});
