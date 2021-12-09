import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BypassHTMLPipe } from './bypass-html.pipe';

const MOCK_CONTENT_BYPASS = 'safeString';
@Component({
  selector: 'tsl-test',
  template: '{{content | bypassHTML}}',
})
class MockComponent {
  safeHTML: string;
}

describe('BypassHTMLPipe', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: () => MOCK_CONTENT_BYPASS,
          },
        },
      ],
      declarations: [MockComponent, BypassHTMLPipe],
    });
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
  });

  it('should return the content as safe html', () => {
    component.safeHTML = 'abcd';

    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.textContent).toBe(MOCK_CONTENT_BYPASS);
  });
});
