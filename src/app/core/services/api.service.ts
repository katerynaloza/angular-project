import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import {  Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly BASE = 'https://api.spaceflightnewsapi.net/v4/articles';

  constructor(private http: HttpClient) {}

  private toArticle = (it: any): Article => ({
    id: it.id,
    title: it.title,
    summary: it.summary,
    imageUrl: it.image_url || it.imageUrl,
    publishedAt: it.published_at || it.publishedAt,
  });

  getArticles(limit = 50) {
    return this.http
      .get<{ results: any[] }>(`${this.BASE}/?limit=${limit}`)
      .pipe(map(res => (res.results || []).map(this.toArticle)));
  }

  getArticleById(id: number) {
    return this.http
      .get<any>(`${this.BASE}/${id}/`)
      .pipe(map(this.toArticle));
  }
}

