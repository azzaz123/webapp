import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, SecurityContext } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SvgService } from '../svg.service';
import { SvgIconComponent } from './svg-icon.component';

describe('SvgIconComponent', () => {
  const svgTag: string = '<svg></svg>'
  let component: SvgIconComponent;
  let fixture: ComponentFixture<SvgIconComponent>;
  let svgService: SvgService;
  let domSanitizer: DomSanitizer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [SvgIconComponent],
      providers: [
        {
          provide: ElementRef, useValue: {
            nativeElement: {}
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

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
      it('svg must be shown in the HTML', () => {
        spyOn(svgService, 'getIconByPath').and.returnValue(of(svgTag));
        component.src = 'mySvg.svg';

        fixture.detectChanges();
        component.ngOnInit();

        const secureSvg: SafeHtml = domSanitizer.bypassSecurityTrustHtml(svgTag);
        const sanitizedSvg: string = domSanitizer.sanitize(SecurityContext.HTML, secureSvg);
        const innerHTML: HTMLElement = fixture.elementRef.nativeElement.innerHTML;

        spyOn(domSanitizer, 'bypassSecurityTrustHtml').and.callThrough();
        spyOn(domSanitizer, 'sanitize');

        component.ngOnInit();

        expect(svgService.getIconByPath).toHaveBeenCalledWith(component.src);
        expect(domSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(svgTag);
        expect(domSanitizer.sanitize).toHaveBeenCalledWith(SecurityContext.HTML, secureSvg);
        expect(innerHTML).toBe(sanitizedSvg);
      });
    });

    describe('if the src is not a svg', () => {
      it('nothing should be displayed in the HTML', () => {
        const innerHTML: HTMLElement = fixture.elementRef.nativeElement.innerHTML;
        component.src = 'myPhoto.png';
        spyOn(svgService, 'getIconByPath');

        fixture.detectChanges();
        component.ngOnInit();

        expect(svgService.getIconByPath).not.toHaveBeenCalled();
        expect(innerHTML).toBe("");
      });
    });
  });

});
