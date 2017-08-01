import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../core/category/category.service";
import { environment } from "../../environments/environment";
import { EventService } from "../core/event/event.service";

@Component({
  selector: 'tsl-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  public categories: any;
  public selectedCategory: any;

  constructor(private categoryService: CategoryService,
              private eventService: EventService) { }

  ngOnInit() {
    this.getCategories();
  }

  public getCategories(){
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  public selectCategory(category: any) {
    this.selectedCategory = category;
    this.eventService.emit(EventService.UPDATE_CATEGORY, category);
  }

}
