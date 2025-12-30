import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/Services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private searchService: SearchService) {}
  isHomePage(): boolean {
    return this.router.url === '/';
  }
  title = 'online-retail';
  onSearch(searchTerm: string) {
    this.searchService.updateSearchTerm(searchTerm.trim());
}
}
