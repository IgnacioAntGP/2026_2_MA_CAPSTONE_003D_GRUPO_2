import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionAyudantiaPage } from './gestion-ayudantia.page';

describe('GestionAyudantiaPage', () => {
  let component: GestionAyudantiaPage;
  let fixture: ComponentFixture<GestionAyudantiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAyudantiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
