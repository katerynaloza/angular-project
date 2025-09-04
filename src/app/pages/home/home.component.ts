import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../core/services/api.service';
import { Store } from '../../core/services/store.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged  } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HighlightPipe } from  '../../shared/highlite.pipe';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HighlightPipe
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  filter = new FormControl('', { nonNullable: true });
  loading = false;

  articles$: typeof this.store.filteredArticles$;
  rawArticles$: typeof this.store.articles$;

  constructor(private api: Api, private store: Store) {
    this.articles$ = this.store.filteredArticles$;
    this.rawArticles$ = this.store.articles$;
  }

  ngOnInit(): void {
    this.loading = true;
    this.api.getArticles(50).subscribe({
      next: list => {
        this.store.setArticles(list);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.filter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(value => this.store.setFilter(value));
  }

  short(text: string): string {
    if (!text) return '';
    return text.length > 100 ? text.slice(0, 100) + '…' : text;
  }
}