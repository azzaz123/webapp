import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CategoryService } from '../../../core/category/category.service';
import { CategoryResponse } from '../../../core/category/category-response.interface';
import { environment } from '../../../../environments/environment';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  public categories: Array<CategoryResponse> = [];
  public selectedCategory: CategoryResponse;
  public homeUrl: string;
  @Output() public newCategory = new EventEmitter<CategoryResponse>();

  constructor(private categoryService: CategoryService,
    private i18n: I18nService,
    @Inject('SUBDOMAIN') private subdomain: string) { }

  ngOnInit() {
    this.getCategories();
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  public getCategories() {
    this.categoryService.getCategories().subscribe((data: Array<CategoryResponse>) => {
      this.categories = data;
    });
  }

  public selectCategory(category: CategoryResponse) {
    this.selectedCategory = category;
    this.newCategory.emit(category);
  }

}
