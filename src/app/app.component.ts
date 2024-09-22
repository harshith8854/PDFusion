import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, output, ViewChild, viewChild } from '@angular/core';
import { PageSelectorListComponent } from "./page-selector-list/page-selector-list.component";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PDFDocument } from 'pdf-lib';
import '@material/web/button/filled-button.js';
import { CommonModule } from '@angular/common';
import { PDFDetails, PDFFile } from './models/pdf-file';
import { Page } from './models/page';
import { ApplicationContext } from './contexts/application.context';
import { ColorService } from './services/color.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageSelectorListComponent, PdfViewerModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class AppComponent {
  inputFiles: PDFFile[] = [];
  pdfDocs: PDFDocument[] = [];
  showPDF: string | undefined;
  showPage: number | undefined;
  showPDFName: string = '';
  pageCount = 0;
  outputFileName: string = 'output.pdf';
  applicationContext: ApplicationContext = inject(ApplicationContext);
  @ViewChild(PageSelectorListComponent)
  pageSelectorListComponent!: PageSelectorListComponent;

  constructor(public colorService: ColorService) {
  }

  async onFileSelected(event: any) {
    const fileCount = event.target.files.length;
    let currentFile = 1;
    for (const file of event.target.files) {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        console.log('reading file', file.name);
        const arrayBuffer = fileReader.result as string;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        this.pdfDocs.push(pdfDoc); //used in generating output
        const fileColor = this.colorService.generateBrightColor();
        const pdfFile = new PDFFile(file.name, arrayBuffer, pdfDoc.getPageCount(), fileColor);
        this.inputFiles.push(pdfFile); //used in displaying pdf
        this.applicationContext.inputFileDetails.next(new PDFDetails(file.name, pdfDoc.getPageCount(), fileColor, pdfFile.id));
        if (currentFile === fileCount) {
          console.log('completed reading all files');
          this.showPDF = this.inputFiles[0].data;
          this.showPDFName = this.inputFiles[0].name;
          this.showPage = 1;
        }
        currentFile++;
      }
      fileReader.readAsDataURL(file);
    }
  }


  deleteFile(index: number) {
    this.pageSelectorListComponent.deletePagesOfFile(this.inputFiles[index].id);
    this.inputFiles.splice(index, 1);
    this.pdfDocs.splice(index, 1);
    if(this.inputFiles.length == 0) {
      this.showPDF = undefined;
      this.showPage = undefined;
      this.showPDFName = '';
    } else {
      this.showPDF = this.inputFiles[0].data;
      this.showPDFName = this.inputFiles[0].name;
      this.showPage = 1;
    }
  }

  displayPage(page: Page) {
    this.showPage = page.pageNumber;
    if(this.showPDFName != page.fileName) {  
      this.showPDF = undefined;
      this.showPDFName = page.fileName;    
      this.showPDF = this.inputFiles.find(file => file.name === page.fileName)?.data;
    }
    
    console.log(`displaying page ${page.pageNumber} from file: ${page.fileName}`);
  }

  async generateOutput(pageList: PageSelectorListComponent) {
    const pages: Page[] = [];
    pageList.pages.filter(p => p.isSelected).map(p => pages.push(p));
    const newPDF = await PDFDocument.create();
    for (const page of pages) {
      const fileIndex = this.inputFiles.findIndex(file => file.name === page.fileName);
      if (fileIndex !== -1) {
        const [newPage] = await newPDF.copyPages(this.pdfDocs[fileIndex], [page.pageNumber - 1]);
        newPDF.addPage(newPage);
      } else {
        console.error(`File with name ${page.fileName} not found in inputFiles.`);
      }
    }
    const newPdfBytes = await newPDF.save();
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
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
    this.outputFileName = (event.target.value ? event.target.value : 'output') + ".pdf";
  }
}
