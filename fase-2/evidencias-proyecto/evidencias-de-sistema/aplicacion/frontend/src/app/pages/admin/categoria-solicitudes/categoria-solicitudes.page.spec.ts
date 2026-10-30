import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaSolicitudesPage } from './categoria-solicitudes.page';

describe('CategoriaSolicitudesPage', () => {
  let component: CategoriaSolicitudesPage;
  let fixture: ComponentFixture<CategoriaSolicitudesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaSolicitudesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
