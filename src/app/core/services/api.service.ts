import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ArticleData, ArticleDetail } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly BASE = 'https://dev.to/api/articles';

  constructor(private http: HttpClient) {}

  private toArticleData = (it: any): ArticleData => ({
    id: it.id,
    title: it.title,
    summary: it.description,
    imageUrl: it.cover_image || it.social_image || '',
    publishedAt: it.published_at,
    url: it.url,
  });

  private toArticleDetail = (it: any): ArticleDetail => ({
    id: it.id,
    title: it.title,
    summary: it.description,
    imageUrl: it.cover_image || it.social_image || '',
    publishedAt: it.published_at,
    url: it.url,
    contentHTML: it.body_html,
  });

  getArticles(limit = 100, tag?: string): Observable<ArticleData[]> {
    let params = new HttpParams().set('per_page', String(limit));
    if (tag) params = params.set('tag', tag);

    return this.http.get<any[]>(this.BASE, { params }).pipe(
      retry(2),
      map((arr) => (arr ?? []).map(this.toArticleData)),
      catchError((err) => {
        console.error('[Api] getArticles error', err);
        return throwError(() => err);
      })
    );
  }

  getArticleById(id: number): Observable<ArticleDetail> {
    return this.http.get<any>(`${this.BASE}/${id}`).pipe(
      retry(2),
      map(this.toArticleDetail),
      catchError((err) => {
        console.error('[Api] getArticleById error', err);
        return throwError(() => err);
      })
    );
  }
}

