import { v4 as uuidv4 } from 'uuid';

export class PDFFile {
    name: string;
    data: string;
    pageCount: number;
    color: string;
    id: string = uuidv4();
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
    id: string;
    constructor(name: string, pageCount: number, color: string, id: string) {
        this.name = name;
        this.pageCount = pageCount;
        this.color = color;
        this.id = id;
    }
}