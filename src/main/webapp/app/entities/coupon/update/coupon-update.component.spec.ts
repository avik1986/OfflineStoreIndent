import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { CouponService } from '../service/coupon.service';
import { ICoupon } from '../coupon.model';
import { CouponFormService } from './coupon-form.service';

import { CouponUpdateComponent } from './coupon-update.component';

describe('Coupon Management Update Component', () => {
  let comp: CouponUpdateComponent;
  let fixture: ComponentFixture<CouponUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let couponFormService: CouponFormService;
  let couponService: CouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CouponUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CouponUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CouponUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    couponFormService = TestBed.inject(CouponFormService);
    couponService = TestBed.inject(CouponService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const coupon: ICoupon = { id: 'd2da5bdf-05f9-480b-ba8c-82307bde9d7c' };

      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      expect(comp.coupon).toEqual(coupon);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICoupon>>();
      const coupon = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
      jest.spyOn(couponFormService, 'getCoupon').mockReturnValue(coupon);
      jest.spyOn(couponService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coupon }));
      saveSubject.complete();

      // THEN
      expect(couponFormService.getCoupon).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(couponService.update).toHaveBeenCalledWith(expect.objectContaining(coupon));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICoupon>>();
      const coupon = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
      jest.spyOn(couponFormService, 'getCoupon').mockReturnValue({ id: null });
      jest.spyOn(couponService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coupon: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coupon }));
      saveSubject.complete();

      // THEN
      expect(couponFormService.getCoupon).toHaveBeenCalled();
      expect(couponService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICoupon>>();
      const coupon = { id: 'de4780a6-f7e3-45ad-87ba-b73185cef3d2' };
      jest.spyOn(couponService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coupon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(couponService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
