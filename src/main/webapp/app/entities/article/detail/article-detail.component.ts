import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IArticle } from '../article.model';

@Component({
  selector: 'jhi-article-detail',
  templateUrl: './article-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ArticleDetailComponent {
  article = input<IArticle | null>(null);

  previousState(): void {
    window.history.back();
  }
}
