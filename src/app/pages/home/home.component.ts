import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../core/services/api';
import { Store } from '../../core/services/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged  } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import { Highlight } from  '../../shared/highlite.pipe';

@Component({
  selector: 'app-home',
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class Home {

}
export class HomeComponent {}