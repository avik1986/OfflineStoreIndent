import { IStore, NewStore } from './store.model';

export const sampleWithRequiredData: IStore = {
  id: 'b6418b36-83e7-4b56-a77f-af4b6fc15dec',
};

export const sampleWithPartialData: IStore = {
  id: '3b145941-2833-4a0a-921a-ae83fdd6092d',
  name: 'er to',
};

export const sampleWithFullData: IStore = {
  id: '4d2a89c6-fae7-4620-917f-46eedf9a4111',
  name: 'who and',
};

export const sampleWithNewData: NewStore = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
