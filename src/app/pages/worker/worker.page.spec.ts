import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkerPage } from './worker.page';

describe('WorkerPage', () => {
  let component: WorkerPage;
  let fixture: ComponentFixture<WorkerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
