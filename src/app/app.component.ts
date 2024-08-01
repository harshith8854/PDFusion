import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfPageCardComponent } from './pdf-page-card/pdf-page-card.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PdfPageCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
