import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { StoreDetailComponent } from './store-detail.component';

describe('Store Management Detail Component', () => {
  let comp: StoreDetailComponent;
  let fixture: ComponentFixture<StoreDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./store-detail.component').then(m => m.StoreDetailComponent),
              resolve: { store: () => of({ id: '1d725fc9-527e-43ab-bb61-c31c85115fca' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StoreDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load store on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StoreDetailComponent);

      // THEN
      expect(instance.store()).toEqual(expect.objectContaining({ id: '1d725fc9-527e-43ab-bb61-c31c85115fca' }));
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
