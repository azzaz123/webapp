import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordSuggesterComponent } from './keyword-suggester.component';
import { FormsModule } from '@angular/forms';

describe('KeywordSuggesterComponent', () => {
  let component: KeywordSuggesterComponent;
  let fixture: ComponentFixture<KeywordSuggesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ KeywordSuggesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordSuggesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
