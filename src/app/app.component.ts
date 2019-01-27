import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {debounceTime, distinct, filter, map, switchMap} from 'rxjs/operators';

import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Instant Search';
  searchTerm: string;
  private results: any;

  latestSearch = new Subject<String>();

  constructor(public http: HttpClient) {

    this.results =
      this.latestSearch.pipe(
        debounceTime(500),
        distinct(),
        filter(term => !!term),
        switchMap(term =>
          this.http.get(`https://api.github.com/search/repositories?q=${term}&sort=start&order=desc`)
            .pipe(
              map(res => res['items'].map(item => `${item.html_url}`))
            )
      )
      );
  }

  newSearch(term) {
    this.latestSearch.next(term);
  }
}
