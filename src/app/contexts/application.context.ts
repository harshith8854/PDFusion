import { Injectable } from "@angular/core";
import { AsyncSubject, BehaviorSubject, ReplaySubject } from "rxjs";
import { PDFDetails } from "../models/pdf-file";

@Injectable(
    {providedIn: 'root'}
)
export class ApplicationContext {
    inputFileDetails: BehaviorSubject<PDFDetails[]> = new BehaviorSubject<PDFDetails[]>([]);
}   