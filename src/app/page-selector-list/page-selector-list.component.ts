import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input, output } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, moveItemInArray } from '@angular/cdk/drag-drop';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/divider/divider.js'
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/button/filled-button.js';
import { Page } from '../models/page';
import { PDFDetails } from '../models/pdf-file';
import { ApplicationContext } from '../contexts/application.context';
@Component({
  selector: 'app-page-selector-list',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder],
  templateUrl: './page-selector-list.component.html',
  styleUrl: './page-selector-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class PageSelectorListComponent {

  pages: Page[] = [];
  selectAll: boolean = false;
  onPageClick = output<Page>();
  onSave = output<number[]>();
  applicationContext: ApplicationContext = inject(ApplicationContext);

  constructor() {
    this.applicationContext.inputFileDetails.subscribe({
      next: (fileDetails: PDFDetails) => {
          for (let i = 1; i <= fileDetails.pageCount; i++) {
            this.pages.push(new Page(i, false, fileDetails.name, fileDetails.color));
          }
            console.log(`${fileDetails.pageCount} pages added for file: ${fileDetails.name}`);
        }
    });
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

  selectPage(page: Page) {
    this.onPageClick.emit(page);
  }

  reverseOrder() {
    this.pages.reverse();
  }

  deletePagesOfFile(fileName: string) {
    this.pages = this.pages.filter(p => p.fileName !== fileName);
  }
}