import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../../../core/category/category.service';
import { CategoryResponse } from '../../../core/category/category-response.interface';

@Component({
  selector: 'tsl-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  public categories: Array<CategoryResponse> = [];
  public selectedCategory: CategoryResponse;
  @Output() public newCategory = new EventEmitter<CategoryResponse>();

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories();
  }

  public getCategories(){
    this.categoryService.getCategories().subscribe((data: Array<CategoryResponse>) => {
      this.categories = data;
    });
  }

  public selectCategory(category: CategoryResponse) {
    this.selectedCategory = category;
    this.newCategory.emit(category);
  }

}
