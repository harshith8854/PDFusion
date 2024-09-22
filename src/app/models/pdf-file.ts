export class PDFFile {
    name: string;
    data: string;
    pageCount: number;
    color: string;
    constructor(name: string, data: string, pageCount: number, color: string) {
        this.name = name;
        this.data = data;
        this.pageCount = pageCount;
        this.color = color;
    }
}

export class PDFDetails {
    name: string;
    pageCount: number;
    color: string;
    constructor(name: string, pageCount: number, color: string) {
        this.name = name;
        this.pageCount = pageCount;
        this.color = color;
    }
}