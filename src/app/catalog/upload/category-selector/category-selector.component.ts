import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent {

  @Input() categoryId: string;

  constructor(private router: Router) {
  }

  public changeCategory(categoryId: string) {
    this.router.navigate(['/catalog/upload/' + categoryId]);
  }

}
