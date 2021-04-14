import { Injectable } from '@angular/core';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';

// TODO: TechDebt. In the end, we need two instances that are the same. We need to slightly rethink how to better handle this
@Injectable()
export class FilterParameterStoreService extends FilterParameterDraftService {}
