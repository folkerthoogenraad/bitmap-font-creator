import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontImageDisplayComponent } from './font-image-display.component';

describe('FontImageDisplayComponent', () => {
  let component: FontImageDisplayComponent;
  let fixture: ComponentFixture<FontImageDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontImageDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FontImageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
