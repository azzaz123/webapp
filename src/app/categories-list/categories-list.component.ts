import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../core/category/category.service";
import { EventService } from "../core/event/event.service";
import { CategoryResponse } from "../core/category/category-response.interface";

@Component({
  selector: 'tsl-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  public categories: Array<CategoryResponse> = [];
  public selectedCategory: CategoryResponse;

  constructor(private categoryService: CategoryService,
              private eventService: EventService) { }

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
    this.eventService.emit(EventService.UPDATE_CATEGORY, category);
  }

}
