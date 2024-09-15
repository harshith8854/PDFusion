import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { PageSelectorListComponent } from "./page-selector-list/page-selector-list.component";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PDFDocument } from 'pdf-lib';
import '@material/web/button/filled-button.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageSelectorListComponent, PdfViewerModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  pdfSrc: Uint8Array | undefined;
  showPage = 1;
  pageCount = 10;
  pdfDoc: any;
  outputFileName: string = 'output.pdf';
  inputFileName: string | undefined;

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    this.inputFileName = file.name;
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      this.pdfSrc = fileReader.result as Uint8Array;
      this.pdfDoc = await PDFDocument.load(this.pdfSrc);
    }
    fileReader.readAsArrayBuffer(file);
  }

  afterLoadComplete(pdf: any) {
    this.pageCount = pdf['_pdfInfo']['numPages'];
  }

  displayPage(page: number) {
    this.showPage = page;
  }

  async generateOutput(pageList: PageSelectorListComponent) {
    const pages: number[] = [];
    pageList.pages.filter(p => p.isSelected).map(p => pages.push(p.pageNumber));
    const newPDF = await PDFDocument.create();
    for (const element of pages) {      
      const [page] = await newPDF.copyPages(this.pdfDoc, [element-1]); //PDFDocument indexes the pages from 0
      newPDF.addPage(page);
    }
    const pdfBytes = await newPDF.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    this.downloadFile(blob, this.outputFileName);
  }

  downloadFile(blob: Blob, filename: string) {
    // Create a new object URL from the Blob
    const url = window.URL.createObjectURL(blob);
  
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // Set the filename
  
    // Append the anchor to the body (required for some browsers)
    document.body.appendChild(a);
  
    // Programmatically click the anchor to trigger the download
    a.click();
  
    // Remove the anchor from the DOM
    document.body.removeChild(a);
  
    // Revoke the object URL after the download
    window.URL.revokeObjectURL(url);
  }

  setOutputFileName(event: any) {   
    this.outputFileName = (event.target.value ? event.target.value : 'output') +".pdf";
  }
}
