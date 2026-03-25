import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyProbeComponent } from './survey-probe.component';

describe('SurveyProbeComponent', () => {
  let component: SurveyProbeComponent;
  let fixture: ComponentFixture<SurveyProbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyProbeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyProbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
