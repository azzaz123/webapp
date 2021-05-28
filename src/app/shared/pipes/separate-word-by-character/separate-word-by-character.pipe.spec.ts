import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeparateWordByCharacterPipe } from './separate-word-by-character.pipe';

const MOCK_IBAN = 'ES9121000418450200051332';
const MOCK_FORMATTED_BY_SPACE_AND_FOUR_SPACES_IBAN = 'ES91 2100 0418 4502 0005 1332';
const MOCK_FORMATTED_BY_DOT_AND_THREE_SPACES_IBAN = 'ES9.121.000.418.450.200.051.332';

@Component({
  template: '{{value | separateWordByCharacter:delimiter:character}}',
})
class MockComponent {
  public value: string;
  public delimiter: number;
  public character: string;
}

describe('SeparateWordByCharacterPipe', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent, SeparateWordByCharacterPipe],
    });
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
  });

  describe('when introducing a value...', () => {
    it('should split the text every four characters and unify it with the space as character', () => {
      component.value = MOCK_IBAN;
      component.delimiter = 4;
      component.character = ' ';

      fixture.detectChanges();

      const shownText = fixture.debugElement.nativeElement.textContent;
      expect(shownText).toBe(MOCK_FORMATTED_BY_SPACE_AND_FOUR_SPACES_IBAN);
    });

    it('should split the text every three characters and unify it with the dot as character', () => {
      component.value = MOCK_IBAN;
      component.delimiter = 3;
      component.character = '.';

      fixture.detectChanges();

      const shownText = fixture.debugElement.nativeElement.textContent;
      expect(shownText).toBe(MOCK_FORMATTED_BY_DOT_AND_THREE_SPACES_IBAN);
    });
  });
});
