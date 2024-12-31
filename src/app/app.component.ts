import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from '@angular/core';
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
  currentPage: number = 1;
  currentInputFile: PDFFile | undefined;
  applicationContext: ApplicationContext = inject(ApplicationContext);
  @ViewChild(PageSelectorListComponent)
  pageSelectorListComponent!: PageSelectorListComponent;
  invalidFileNames: string[] = [];

  constructor(public colorService: ColorService) {
  }

  async onFileSelected(event: any) {
    if (this.inputFiles.length == 0) {
      this.invalidFileNames = [];
      const fileCount = this.inputFiles.length + event.target.files.length;
      let inputFileDetails: PDFDetails[] = [];
      for (const file of event.target.files) {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          console.log('reading file', file.name);
          const arrayBuffer = fileReader.result as string;
          try {
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            this.pdfDocs.push(pdfDoc); //used in generating output
            const fileColor = this.colorService.generateBrightColor();
            const pdfFile = new PDFFile(file.name, arrayBuffer, pdfDoc.getPageCount(), fileColor);
            this.inputFiles.push(pdfFile); //used in displaying pdf
            inputFileDetails.push(new PDFDetails(file.name, pdfDoc.getPageCount(), fileColor, pdfFile.id));
          } catch (error) {
            this.invalidFileNames.push(file.name);
            console.error('Error while parsing the file')
          }
          if (this.inputFiles.length === fileCount) {
            console.log('completed reading all files');
            this.showPDF = this.inputFiles[0].data;
            this.showPDFName = this.inputFiles[0].name;
            this.showPage = 1;
            this.applicationContext.inputFileDetails.next(inputFileDetails);
            this.currentInputFile = this.inputFiles[0];
          }
          if (this.invalidFileNames.length > 0) {
            this.eraseContext();
          }
        }
        fileReader.readAsDataURL(file);
      }
    } else {
      for (const file of event.target.files) {
        let inputFileDetails: PDFDetails[] = [];
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          console.log('reading file', file.name);
          const arrayBuffer = fileReader.result as string;
          try {
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            this.pdfDocs.push(pdfDoc); //used in generating output
            const fileColor = this.colorService.generateBrightColor();
            const pdfFile = new PDFFile(file.name, arrayBuffer, pdfDoc.getPageCount(), fileColor);
            this.inputFiles.push(pdfFile); //used in displaying pdf
            inputFileDetails.push(new PDFDetails(file.name, pdfDoc.getPageCount(), fileColor, pdfFile.id));
            this.applicationContext.inputFileDetails.next(inputFileDetails);
          } catch (error) {
            this.invalidFileNames.push(file.name);
            console.error('Error while parsing the file')
          }
        }
        fileReader.readAsDataURL(file);
      }
    }
  }


  deleteFile(index: number) {
    this.pageSelectorListComponent.deletePagesOfFile(this.inputFiles[index].id);
    this.inputFiles.splice(index, 1);
    this.pdfDocs.splice(index, 1);
    if (this.inputFiles.length == 0) {
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
    if (this.showPDFName != page.fileName) {
      this.showPage = undefined;
      this.showPDF = undefined;
      this.showPDFName = page.fileName;
      this.showPDF = this.inputFiles.find(file => file.id === page.fileId)?.data;
    }
    this.showPage = page.pageNumber;
    this.currentPage = page.pageNumber;
    this.currentInputFile = this.inputFiles.find(file => file.id === page.fileId);
    console.log(`displaying page ${page.pageNumber} from file: ${page.fileName}`);
  }

  displayFile(index: number){
    if(this.showPDFName != this.inputFiles[index].name){
      this.showPage = undefined;
      this.showPDF = undefined;
      this.showPDFName = this.inputFiles[index].name;
      this.showPDF = this.inputFiles[index].data;
    }
    this.showPage = 1;
    this.currentPage = 1;
    this.currentInputFile = this.inputFiles[index];
    console.log(`displaying file: ${this.inputFiles[index].name}`);
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

  /**
   * Event handler for when a page is rendered.
   * 
   * @param event - The event object containing details about the rendered page.
   * @property event.pageNumber - The number of the page that was rendered.
   * 
   * This is a workaround for the issue where the PDF viewer does not display the correct page when the user navigates to a different PDF.
   * Issue: For some reason when a new PDF source is provided to the PDF viewer, it is displaying the 2nd page when the page number is set greater than 2.
   * showPage is two way bound to pdf viewer. pdf viewer sets the showPage to '2' when the page is set greater than 2 for a new pdf,
   * this will pass correct page input to pdf viewer and it will display the correct page.
   */
  onPageRendered(event: any) {
    if (event.pageNumber == this.showPage) {
      this.showPage = this.currentPage;
    }
  }

  eraseContext() {
    this.inputFiles = [];
    this.pdfDocs = [];
    this.showPDF = undefined;
    this.showPage = undefined;
    this.showPDFName = '';
    this.pageCount = 0;
    this.outputFileName = 'output.pdf';
    this.currentPage = 1;
    this.currentInputFile = undefined;
    this.applicationContext.inputFileDetails.next([]);
  }
}
