export class Page {
    pageNumber: number;
    isSelected: boolean;
    fileName: string;
    fileColor: string;
    fileId: string;
    constructor(pageNumber: number, isSelected: boolean, fileName: string, fileColor: string, fileId: string) {
      this.pageNumber = pageNumber;
      this.isSelected = isSelected;
      this.fileName = fileName;
      this.fileColor = fileColor;
      this.fileId = fileId;
    }
}