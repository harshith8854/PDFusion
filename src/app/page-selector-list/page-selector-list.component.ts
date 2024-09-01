import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
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

  pageCount = input(10);
  pages: Page[] = [];
  selectAll: boolean = false;
  constructor() {
    for (let i = 1; i <= this.pageCount(); i++) {
      this.pages.push(new Page(i, false));
    }
  }

  // this function will handle the drag and drop of pages
  drop(event: CdkDragDrop<Page[]>) {
    moveItemInArray(this.pages, event.previousIndex, event.currentIndex);
  }

  // this function will move the page up in the list
  moveUp(index: number) {
    if (index > 0) {
      const temp = this.pages[index];
      this.pages[index] = this.pages[index - 1];
      this.pages[index - 1] = temp;
    }
  }

  // this function will move the page down in the list
  moveDown(index: number) {
    if (index < this.pages.length - 1) {
      const temp = this.pages[index];
      this.pages[index] = this.pages[index + 1];
      this.pages[index + 1] = temp;
    }
  }

  // this function will toggle the selection of a page
  toggleSelect(index: number) {
    this.pages[index].isSelected = !this.pages[index].isSelected;
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.pages.map(page => page.isSelected = this.selectAll);
  }

  // this function will return list of pages that are selected and in the order as chosen by user
  save() {
    let final_pages: number[] = [];
    this.pages.filter(page => page.isSelected).map(page => final_pages.push(page.pageNumber));
    console.log(final_pages);
    return final_pages;
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