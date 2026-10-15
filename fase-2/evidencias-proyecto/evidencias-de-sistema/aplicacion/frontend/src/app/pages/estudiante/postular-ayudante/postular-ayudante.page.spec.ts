import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostularAyudantePage } from './postular-ayudante.page';

describe('PostularAyudantePage', () => {
  let component: PostularAyudantePage;
  let fixture: ComponentFixture<PostularAyudantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostularAyudantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
