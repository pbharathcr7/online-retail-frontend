import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  public searchTerm = new BehaviorSubject<string>(''); 

  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
  }
}