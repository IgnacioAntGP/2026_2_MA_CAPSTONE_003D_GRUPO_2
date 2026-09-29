import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleConsultaPage } from './detalle-consulta.page';

describe('DetalleConsultaPage', () => {
  let component: DetalleConsultaPage;
  let fixture: ComponentFixture<DetalleConsultaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
