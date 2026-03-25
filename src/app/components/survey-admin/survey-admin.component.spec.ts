import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAdminComponent } from './survey-admin.component';

describe('SurveyAdminComponent', () => {
  let component: SurveyAdminComponent;
  let fixture: ComponentFixture<SurveyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
