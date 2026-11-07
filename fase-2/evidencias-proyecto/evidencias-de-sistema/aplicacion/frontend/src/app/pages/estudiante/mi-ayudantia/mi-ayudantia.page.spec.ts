import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiAyudantiaPage } from './mi-ayudantia.page';

describe('MiAyudantiaPage', () => {
  let component: MiAyudantiaPage;
  let fixture: ComponentFixture<MiAyudantiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiAyudantiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
