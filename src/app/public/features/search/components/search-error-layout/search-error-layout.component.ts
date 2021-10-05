import { Component } from '@angular/core';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { ERROR_BOX_EXIT_TYPE } from '@shared/error-box/interfaces/error-box-exit-type';
import { ErrorBoxExit } from '@shared/error-box/interfaces/error-box-exit.interface';

@Component({
  selector: 'tsl-search-error-layout',
  templateUrl: './search-error-layout.component.html',
  styleUrls: ['./search-error-layout.component.scss'],
})
export class SearchErrorLayoutComponent {
  public noResultsTitle = $localize`:@@web_search_no_results_title:Sorry, we weren't able to find what you're looking for at the moment`;
  public noResultsSubtitle = $localize`:@@web_search_no_results_subtitle:Try changing your search terms, or take a chance and discover something unexpected in the land of wallapop`;
  public noResultsImage = '/assets/images/commons/sad.svg';
  public exitButtonProps: ErrorBoxExit = {
    type: ERROR_BOX_EXIT_TYPE.BUTTON,
    label: $localize`:@@web_search_no_results_button_text:New search`,
  };

  constructor(private searchNavigatorService: SearchNavigatorService) {}

  public redirectToEmptySearch(): void {
    this.searchNavigatorService.navigateWithLocationParams({});
  }
}
