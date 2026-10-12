import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostulacionesAyudantePage } from './postulaciones-ayudante.page';

describe('PostulacionesAyudantePage', () => {
  let component: PostulacionesAyudantePage;
  let fixture: ComponentFixture<PostulacionesAyudantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostulacionesAyudantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
