import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPageCardComponent } from './pdf-page-card.component';

describe('PdfPageCardComponent', () => {
  let component: PdfPageCardComponent;
  let fixture: ComponentFixture<PdfPageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPageCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfPageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
