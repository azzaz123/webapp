import { Component, OnInit } from '@angular/core';
import { CategoryService } from "../core/category/category.service";

@Component({
  selector: 'tsl-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  public categories: any;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories();
  }

  public getCategories(){
    this.categoryService.getCategories().subscribe((data: any) => {
      console.log(data);
      this.categories = data;
    });
  }

}
