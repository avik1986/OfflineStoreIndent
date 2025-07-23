import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { RDCheckoutDetailComponent } from './rd-checkout-detail.component';

describe('RDCheckout Management Detail Component', () => {
  let comp: RDCheckoutDetailComponent;
  let fixture: ComponentFixture<RDCheckoutDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDCheckoutDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./rd-checkout-detail.component').then(m => m.RDCheckoutDetailComponent),
              resolve: { rDCheckout: () => of({ id: '8901de36-fe45-4be2-ba21-04ced2582ff4' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RDCheckoutDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RDCheckoutDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load rDCheckout on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RDCheckoutDetailComponent);

      // THEN
      expect(instance.rDCheckout()).toEqual(expect.objectContaining({ id: '8901de36-fe45-4be2-ba21-04ced2582ff4' }));
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
