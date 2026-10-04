import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelAyudantePage } from './panel-ayudante.page';

describe('PanelAyudantePage', () => {
  let component: PanelAyudantePage;
  let fixture: ComponentFixture<PanelAyudantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelAyudantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
