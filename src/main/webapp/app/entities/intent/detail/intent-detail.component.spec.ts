import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { IntentDetailComponent } from './intent-detail.component';

describe('Intent Management Detail Component', () => {
  let comp: IntentDetailComponent;
  let fixture: ComponentFixture<IntentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntentDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./intent-detail.component').then(m => m.IntentDetailComponent),
              resolve: { intent: () => of({ id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(IntentDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load intent on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', IntentDetailComponent);

      // THEN
      expect(instance.intent()).toEqual(expect.objectContaining({ id: '874671f8-75b6-4a01-aa2e-c8f15cd4a2eb' }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
