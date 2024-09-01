import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, moveItemInArray} from '@angular/cdk/drag-drop';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/divider/divider.js'
import '@material/web/checkbox/checkbox.js';

@Component({
  selector: 'app-page-selector-list',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder],
  templateUrl: './page-selector-list.component.html',
  styleUrl: './page-selector-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageSelectorListComponent {

  pages: Page[] = [];
  constructor() {
    for (let i = 1; i <= 10; i++) {
      this.pages.push(new Page(i, false));
    }
  }

  drop(event: CdkDragDrop<Page[]>) {
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
  }

  moveUp(index: number) {
    if (index > 0) {
      const temp = this.pages[index];
      this.pages[index] = this.pages[index - 1];
      this.pages[index - 1] = temp;
    }
  }

  moveDown(index: number) {
    if (index < this.pages.length - 1) {
      const temp = this.pages[index];
      this.pages[index] = this.pages[index + 1];
      this.pages[index + 1] = temp;
    }
  }
}

export class Page {
  pageNumber: number;
  isSelected: boolean;
  constructor(pageNumber: number, isSelected: boolean) {
    this.pageNumber = pageNumber;
    this.isSelected = isSelected;
  }
}