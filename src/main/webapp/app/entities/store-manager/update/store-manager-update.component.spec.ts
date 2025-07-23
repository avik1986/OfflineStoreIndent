import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { StoreManagerService } from '../service/store-manager.service';
import { IStoreManager } from '../store-manager.model';
import { StoreManagerFormService } from './store-manager-form.service';

import { StoreManagerUpdateComponent } from './store-manager-update.component';

describe('StoreManager Management Update Component', () => {
  let comp: StoreManagerUpdateComponent;
  let fixture: ComponentFixture<StoreManagerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let storeManagerFormService: StoreManagerFormService;
  let storeManagerService: StoreManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreManagerUpdateComponent],
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
      .overrideTemplate(StoreManagerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StoreManagerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    storeManagerFormService = TestBed.inject(StoreManagerFormService);
    storeManagerService = TestBed.inject(StoreManagerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const storeManager: IStoreManager = { id: '17d79568-cef7-4bd9-9557-ac1486320f2f' };

      activatedRoute.data = of({ storeManager });
      comp.ngOnInit();

      expect(comp.storeManager).toEqual(storeManager);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreManager>>();
      const storeManager = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
      jest.spyOn(storeManagerFormService, 'getStoreManager').mockReturnValue(storeManager);
      jest.spyOn(storeManagerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeManager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: storeManager }));
      saveSubject.complete();

      // THEN
      expect(storeManagerFormService.getStoreManager).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(storeManagerService.update).toHaveBeenCalledWith(expect.objectContaining(storeManager));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreManager>>();
      const storeManager = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
      jest.spyOn(storeManagerFormService, 'getStoreManager').mockReturnValue({ id: null });
      jest.spyOn(storeManagerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeManager: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: storeManager }));
      saveSubject.complete();

      // THEN
      expect(storeManagerFormService.getStoreManager).toHaveBeenCalled();
      expect(storeManagerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStoreManager>>();
      const storeManager = { id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' };
      jest.spyOn(storeManagerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ storeManager });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(storeManagerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
