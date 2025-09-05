import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'article/:id', component: ArticleDetailComponent },
    { path: '**', redirectTo: '' },
];
