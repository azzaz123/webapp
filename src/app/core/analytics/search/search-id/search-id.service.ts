import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE_TOKEN } from '@core/local-storage/local-storage.token';
import { SearchIdRecord } from './interfaces/search-id-record.interface';
import { SearchId } from './interfaces/search-id.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchIdService {
  private readonly STORAGE_KEY = 'searchId';
  private readonly STORAGE_SYSTEM: Storage;
  private readonly EXPIRATION_MS = 3600 * 2 * 1000;

  constructor(@Inject(LOCAL_STORAGE_TOKEN) private localStorage: Storage) {
    this.STORAGE_SYSTEM = this.localStorage;
  }

  public setSearchIdByItemId(itemId: string, searchId: string): void {
    const searchIdRecord = this.getSearchIdRecord();

    searchIdRecord[itemId] = {
      searchId: searchId,
      creation: new Date().getTime(),
    };

    this.STORAGE_SYSTEM.setItem(this.STORAGE_KEY, JSON.stringify(searchIdRecord));
  }

  public getSearchIdByItemId(itemId): string | null {
    const searchId = this.getSearchIdRecord()[itemId];

    if (searchId) {
      if (this.isExpired(searchId)) {
        this.deleteSearchIdByItemId(itemId);
        return null;
      }

      return searchId.searchId || null;
    }

    return null;
  }

  public deleteSearchIdByItemId(itemId: string): void {
    const searchIdRecord = this.getSearchIdRecord();
    delete searchIdRecord[itemId];
    this.STORAGE_SYSTEM.setItem(this.STORAGE_KEY, JSON.stringify(searchIdRecord));
  }

  public deleteAll(): void {
    this.STORAGE_SYSTEM.removeItem(this.STORAGE_KEY);
  }

  private getSearchIdRecord(): SearchIdRecord {
    try {
      return JSON.parse(this.STORAGE_SYSTEM.getItem(this.STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  private isExpired(searchId: SearchId): boolean {
    return Date.now() - new Date(searchId.creation).getTime() > this.EXPIRATION_MS;
  }
}
