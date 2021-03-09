import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { ItemTaxonomiesComponent } from './item-taxonomies.component';

describe('ItemTaxonomiesComponent', () => {
  let component: ItemTaxonomiesComponent;
  let fixture: ComponentFixture<ItemTaxonomiesComponent>;
  const itemTaxonomyClass = '.ItemTaxonomy';
  const parentTaxonomyId = '#parentTaxonomy';
  const childTaxonomyId = '#childTaxonomy';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemTaxonomiesComponent],
      imports: [SvgIconModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTaxonomiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when checking if a taxonomy is defined...', () => {
    it('should return true if the taxonomy have a valid value', () => {
      expect(component.taxonomyIsDefined('Fashion')).toBe(true);
    });

    it('should return false if the taxonomy have a invalid value', () => {
      expect(component.taxonomyIsDefined('')).toBe(false);
      expect(component.taxonomyIsDefined(null)).toBe(false);
      expect(component.taxonomyIsDefined(undefined)).toBe(false);
    });
  });

  describe('when the parent taxonomy is defined...', () => {
    beforeEach(() => {
      component.parentTaxonomy = 'Books';
      fixture.detectChanges();
    });

    it('should show the parent taxonomy', () => {
      const taxonomies = fixture.debugElement.queryAll(By.css(itemTaxonomyClass));
      const parentTaxonomy = fixture.debugElement.query(By.css(parentTaxonomyId));

      expect(taxonomies.length).toBe(1);
      expect(parentTaxonomy).toBeTruthy();
    });

    describe('and the child taxonomy is defined too...', () => {
      beforeEach(() => {
        component.childTaxonomy = 'History';
        fixture.detectChanges();
      });

      it('should show the child taxonomy', () => {
        const taxonomies = fixture.debugElement.queryAll(By.css(itemTaxonomyClass));
        const childTaxonomy = fixture.debugElement.query(By.css(childTaxonomyId));

        expect(taxonomies.length).toBe(2);
        expect(childTaxonomy).toBeTruthy();
      });
    });

    describe('and the child taxonomy is NOT defined...', () => {
      it('should NOT show the child taxonomy', () => {
        const taxonomies = fixture.debugElement.queryAll(By.css(itemTaxonomyClass));
        const childTaxonomy = fixture.debugElement.query(By.css(childTaxonomyId));

        expect(taxonomies.length).toBe(1);
        expect(childTaxonomy).toBeFalsy();
      });
    });

    describe('and the icon is defined...', () => {
      it('should show a svg', () => {
        const svg = fixture.debugElement.query(By.directive(SvgIconComponent));

        expect(svg).toBeTruthy();
      });
    });

    describe('and the icon is NOT defined...', () => {
      beforeEach(() => {
        component.iconPath = null;
        fixture.detectChanges();
      });

      it('should not show the icon', () => {
        const svg = fixture.debugElement.query(By.directive(SvgIconComponent));

        expect(svg).toBeFalsy();
      });
    });
  });

  describe('when the parent taxonomy is NOT defined', () => {
    it('should NOT show anything', () => {
      const taxonomies = fixture.debugElement.queryAll(By.css(itemTaxonomyClass));

      expect(taxonomies.length).toBe(0);
    });
  });
});
