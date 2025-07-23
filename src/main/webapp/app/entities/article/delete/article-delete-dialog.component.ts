import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IArticle } from '../article.model';
import { ArticleService } from '../service/article.service';

@Component({
  templateUrl: './article-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ArticleDeleteDialogComponent {
  article?: IArticle;

  protected articleService = inject(ArticleService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.articleService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
