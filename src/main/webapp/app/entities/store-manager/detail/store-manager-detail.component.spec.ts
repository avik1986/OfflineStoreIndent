import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { StoreManagerDetailComponent } from './store-manager-detail.component';

describe('StoreManager Management Detail Component', () => {
  let comp: StoreManagerDetailComponent;
  let fixture: ComponentFixture<StoreManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreManagerDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./store-manager-detail.component').then(m => m.StoreManagerDetailComponent),
              resolve: { storeManager: () => of({ id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(StoreManagerDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreManagerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load storeManager on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', StoreManagerDetailComponent);

      // THEN
      expect(instance.storeManager()).toEqual(expect.objectContaining({ id: '80f1f9e7-7531-41bb-92d7-6d79cb58a43f' }));
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
