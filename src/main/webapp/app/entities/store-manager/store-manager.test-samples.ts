import { IStoreManager, NewStoreManager } from './store-manager.model';

export const sampleWithRequiredData: IStoreManager = {
  id: 'e7e3d394-c9bb-4d75-9e85-bc10eaaca165',
};

export const sampleWithPartialData: IStoreManager = {
  id: 'a7693f43-7280-4dd0-a3fc-823bb9a70de5',
};

export const sampleWithFullData: IStoreManager = {
  id: '28bc3332-8138-4a43-8d71-9c5cba112b87',
  name: 'turbulent tomorrow compromise',
};

export const sampleWithNewData: NewStoreManager = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
