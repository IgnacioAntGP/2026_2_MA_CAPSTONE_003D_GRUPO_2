import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluarTutoriaPage } from './evaluar-tutoria.page';

describe('EvaluarTutoriaPage', () => {
  let component: EvaluarTutoriaPage;
  let fixture: ComponentFixture<EvaluarTutoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluarTutoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
