import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { CouponDetailComponent } from './coupon-detail.component';

describe('Coupon Management Detail Component', () => {
  let comp: CouponDetailComponent;
  let fixture: ComponentFixture<CouponDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./coupon-detail.component').then(m => m.CouponDetailComponent),
              resolve: { coupon: () => of({ id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CouponDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load coupon on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CouponDetailComponent);

      // THEN
      expect(instance.coupon()).toEqual(expect.objectContaining({ id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' }));
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
