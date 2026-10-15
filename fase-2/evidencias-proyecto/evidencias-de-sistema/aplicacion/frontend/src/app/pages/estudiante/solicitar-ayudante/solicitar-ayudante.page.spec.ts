import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarAyudantePage } from './solicitar-ayudante.page';

describe('SolicitarAyudantePage', () => {
  let component: SolicitarAyudantePage;
  let fixture: ComponentFixture<SolicitarAyudantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarAyudantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
