import { Component, OnInit } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '@core/category/category.service';
import { take } from 'rxjs/operators';
import { CategoryResponse } from '@core/category/category-response.interface';

@Component({
  selector: 'tsl-category-listing-modal',
  templateUrl: './category-listing-modal.component.html',
  styleUrls: ['./category-listing-modal.component.scss'],
})
export class CategoryListingModalComponent implements OnInit {
  public subscription: SubscriptionsResponse;
  public categories: CategoryResponse[] = [];

  constructor(private activeModal: NgbActiveModal, private categoryService: CategoryService) {}

  ngOnInit() {
    this.getCategories();
  }

  public onClose(): void {
    this.activeModal.close();
  }

  private getCategories(): void {
    this.subscription.category_ids.forEach((id) => {
      this.categoryService
        .getCategoryById(id)
        .pipe(take(1))
        .subscribe((category) => {
          if (category) {
            this.categories.push({
              ...category,
              icon_id: `/assets/icons/filters/categories/${category.icon_id}.svg`,
            });
          }
        });
    });
  }
}
