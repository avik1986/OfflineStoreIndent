import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { RDCheckoutService } from '../service/rd-checkout.service';
import { IRDCheckout } from '../rd-checkout.model';
import { RDCheckoutFormService } from './rd-checkout-form.service';

import { RDCheckoutUpdateComponent } from './rd-checkout-update.component';

describe('RDCheckout Management Update Component', () => {
  let comp: RDCheckoutUpdateComponent;
  let fixture: ComponentFixture<RDCheckoutUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let rDCheckoutFormService: RDCheckoutFormService;
  let rDCheckoutService: RDCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RDCheckoutUpdateComponent],
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
      .overrideTemplate(RDCheckoutUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RDCheckoutUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    rDCheckoutFormService = TestBed.inject(RDCheckoutFormService);
    rDCheckoutService = TestBed.inject(RDCheckoutService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const rDCheckout: IRDCheckout = { id: 'e7e5a93d-b28f-4946-b416-8e9de1cc51c1' };

      activatedRoute.data = of({ rDCheckout });
      comp.ngOnInit();

      expect(comp.rDCheckout).toEqual(rDCheckout);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRDCheckout>>();
      const rDCheckout = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
      jest.spyOn(rDCheckoutFormService, 'getRDCheckout').mockReturnValue(rDCheckout);
      jest.spyOn(rDCheckoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rDCheckout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rDCheckout }));
      saveSubject.complete();

      // THEN
      expect(rDCheckoutFormService.getRDCheckout).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(rDCheckoutService.update).toHaveBeenCalledWith(expect.objectContaining(rDCheckout));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRDCheckout>>();
      const rDCheckout = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
      jest.spyOn(rDCheckoutFormService, 'getRDCheckout').mockReturnValue({ id: null });
      jest.spyOn(rDCheckoutService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rDCheckout: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: rDCheckout }));
      saveSubject.complete();

      // THEN
      expect(rDCheckoutFormService.getRDCheckout).toHaveBeenCalled();
      expect(rDCheckoutService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRDCheckout>>();
      const rDCheckout = { id: '8901de36-fe45-4be2-ba21-04ced2582ff4' };
      jest.spyOn(rDCheckoutService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ rDCheckout });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(rDCheckoutService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
