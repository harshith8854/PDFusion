import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfPageCardComponent } from './pdf-page-card/pdf-page-card.component';
// index.js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import { PageSelectorListComponent } from "./page-selector-list/page-selector-list.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PdfPageCardComponent, PageSelectorListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  pdfSrc: string | undefined;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.pdfSrc = fileReader.result as string;
    }
    fileReader.readAsArrayBuffer(file);
  }
}
