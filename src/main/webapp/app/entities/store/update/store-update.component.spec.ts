import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { StoreService } from '../service/store.service';
import { IStore } from '../store.model';
import { StoreFormService } from './store-form.service';

import { StoreUpdateComponent } from './store-update.component';

describe('Store Management Update Component', () => {
  let comp: StoreUpdateComponent;
  let fixture: ComponentFixture<StoreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let storeFormService: StoreFormService;
  let storeService: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreUpdateComponent],
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
      .overrideTemplate(StoreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StoreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    storeFormService = TestBed.inject(StoreFormService);
    storeService = TestBed.inject(StoreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const store: IStore = { id: '9cf1d135-42dd-4c1a-a97a-5619d2716dee' };

      activatedRoute.data = of({ store });
      comp.ngOnInit();

      expect(comp.store).toEqual(store);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStore>>();
      const store = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
      jest.spyOn(storeFormService, 'getStore').mockReturnValue(store);
      jest.spyOn(storeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ store });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: store }));
      saveSubject.complete();

      // THEN
      expect(storeFormService.getStore).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(storeService.update).toHaveBeenCalledWith(expect.objectContaining(store));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStore>>();
      const store = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
      jest.spyOn(storeFormService, 'getStore').mockReturnValue({ id: null });
      jest.spyOn(storeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ store: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: store }));
      saveSubject.complete();

      // THEN
      expect(storeFormService.getStore).toHaveBeenCalled();
      expect(storeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStore>>();
      const store = { id: '1d725fc9-527e-43ab-bb61-c31c85115fca' };
      jest.spyOn(storeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ store });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(storeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
