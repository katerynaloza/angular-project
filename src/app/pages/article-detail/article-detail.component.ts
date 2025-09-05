import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Api } from '../../core/services/api.service';
import { ArticleDetail } from '../../core/models/article.model';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-article-detail',
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})

export class ArticleDetailComponent implements OnInit {
  article?: ArticleDetail;
  loading = false;

  constructor(private route: ActivatedRoute, private api: Api) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.loading = true;
    this.api.getArticleById(id).subscribe({
      next: (a:ArticleDetail) => { this.article = a; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
