import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
    providedIn: 'root'
})
export class Store {
      private articlesSubject = new BehaviorSubject<Article[]>([]);
    articles$ = this.articlesSubject.asObservable();

    private filterSubject = new BehaviorSubject<string>('');
    filter$ = this.filterSubject.asObservable();

    setArticles(list: Article[]) {
      this.articlesSubject.next(list);
    }

    setFilter(value: string) {
      this.filterSubject.next(value ?? '');
    }

    filteredArticles$ = combineLatest([this.articles$, this.filter$]).pipe(
      map(([articles, filter]) => {
        const q = (filter || '').trim().toLowerCase();
        if (!q) return articles;

        const tokens = q.split(/\s+/).filter(Boolean);

        const scored = articles
          .map(a => {
            const title = (a.title || '').toLowerCase();
            const desc = (a.summary || '').toLowerCase();

            const titleMatches = tokens.filter(t => title.includes(t)).length;
            const descMatches = tokens.filter(t => desc.includes(t)).length;
            const hasAny = titleMatches > 0 || descMatches > 0;

            return { a, titleMatches, descMatches, hasAny };
          })
          .filter(x => x.hasAny)
          .sort((x, y) => {
            const xTitleFlag = x.titleMatches > 0 ? 1 : 0;
            const yTitleFlag = y.titleMatches > 0 ? 1 : 0;
            if (yTitleFlag !== xTitleFlag) return yTitleFlag - xTitleFlag;

            if (y.titleMatches !== x.titleMatches) return y.titleMatches - x.titleMatches;

            if (y.descMatches !== x.descMatches) return y.descMatches - x.descMatches;

            return 0;
          });

        return scored.map(s => s.a);
      })
    );
}
