import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ArticleData } from '../models/article.model';

interface ScoredArticle {
  article: ArticleData;
  titleMatches: number;
  summaryMatches: number;
  hasAnyMatch: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleStoreService { 
  private readonly articlesSubject = new BehaviorSubject<ArticleData[]>([]);
  public readonly articles$: Observable<ArticleData[]> = this.articlesSubject.asObservable();

  private readonly filterSubject = new BehaviorSubject<string>('');
  public readonly filter$: Observable<string> = this.filterSubject.asObservable();

  constructor() {}

  public setArticles(articles: ArticleData[]): void {
    this.articlesSubject.next(articles);
  }

  public setFilter(value: string): void {
    this.filterSubject.next(value ?? '');
  }

  public readonly filteredArticles$: Observable<ArticleData[]> = combineLatest([
    this.articles$,
    this.filter$
  ]).pipe(
    map(([articles, filter]) => {
      const query = filter.trim().toLowerCase();
      if (!query) {
        return articles; 
      }

      const searchTokens = query.split(/\s+/).filter(Boolean);

      return articles
        .map(article => this.scoreArticle(article, searchTokens))
        .filter(scoredArticle => scoredArticle.hasAnyMatch)
        .sort(this.compareScoredArticles)
        .map(scoredArticle => scoredArticle.article);
    })
  );

  private scoreArticle(article: ArticleData, tokens: string[]): ScoredArticle {
    const title = (article.title ?? '').toLowerCase();
    const summary = (article.summary ?? '').toLowerCase();

    const titleMatches = tokens.filter(token => title.includes(token)).length;
    const summaryMatches = tokens.filter(token => summary.includes(token)).length;

    return {
      article,
      titleMatches,
      summaryMatches,
      hasAnyMatch: titleMatches > 0 || summaryMatches > 0,
    };
  }

  private compareScoredArticles(a: ScoredArticle, b: ScoredArticle): number {
    const hasTitleMatchA = a.titleMatches > 0 ? 1 : 0;
    const hasTitleMatchB = b.titleMatches > 0 ? 1 : 0;
    if (hasTitleMatchB !== hasTitleMatchA) {
      return hasTitleMatchB - hasTitleMatchA;
    }

    if (b.titleMatches !== a.titleMatches) {
      return b.titleMatches - a.titleMatches;
    }

    return b.summaryMatches - a.summaryMatches;
  }
}
