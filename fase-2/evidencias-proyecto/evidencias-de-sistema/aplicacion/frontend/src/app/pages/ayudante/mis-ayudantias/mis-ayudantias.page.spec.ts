import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisAyudantiasPage } from './mis-ayudantias.page';

describe('MisAyudantiasPage', () => {
  let component: MisAyudantiasPage;
  let fixture: ComponentFixture<MisAyudantiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAyudantiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
