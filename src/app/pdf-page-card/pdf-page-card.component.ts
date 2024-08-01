import { Component, input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-pdf-page-card',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './pdf-page-card.component.html',
  styleUrl: './pdf-page-card.component.scss'
})
export class PdfPageCardComponent {
  pdfSrc = input<string>(); ;
  pages: number[] = [];

  afterLoadComplete(pdf: any) {
    console.log(pdf);
  }
}
