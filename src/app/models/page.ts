export class Page {
    pageNumber: number;
    isSelected: boolean;
    fileName: string;
    fileColor: string;
    constructor(pageNumber: number, isSelected: boolean, fileName: string, fileColor: string) {
      this.pageNumber = pageNumber;
      this.isSelected = isSelected;
      this.fileName = fileName;
      this.fileColor = fileColor;
    }
}