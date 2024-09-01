import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSelectorListComponent } from './page-selector-list.component';

describe('PageSelectorListComponent', () => {
  let component: PageSelectorListComponent;
  let fixture: ComponentFixture<PageSelectorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSelectorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSelectorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
