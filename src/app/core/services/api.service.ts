import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators';
import {  Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly BASE = 'https://dev.to/api/articles';


  constructor(private http: HttpClient) {}

  private toArticleList = (it: any): Article => ({
    id: it.id,
    title: it.title,
    summary: it.description,
    imageUrl: it.cover_image || it.social_image || '',
    publishedAt: it.published_at,
    url: it.url
  });

  private toArticleDetail = (it: any): Article => ({
    id: it.id,
    title: it.title,
    summary: it.description,
    imageUrl: it.cover_image || it.social_image || '',
    publishedAt: it.published_at,
    url: it.url,
    contentHTML: it.body_html 
  });

  getArticles(limit = 100, tag?: string) {
    const qs = new URLSearchParams();
    qs.set('per_page', String(limit));
    if (tag) qs.set('tag', tag); 
    return this.http
      .get<any[]>(`${this.BASE}?${qs.toString()}`)
      .pipe(map(arr => (arr || []).map(this.toArticleList)));
  }

  getArticleById(id: number) {
    return this.http
      .get<any>(`${this.BASE}/${id}`)
      .pipe(map(this.toArticleDetail));
  }
}

