import { IArticle, NewArticle } from './article.model';

export const sampleWithRequiredData: IArticle = {
  id: '8b4e5118-450c-4c83-840c-c47efc984807',
  price: 9838.86,
};

export const sampleWithPartialData: IArticle = {
  id: '932be228-f6a9-4c77-b0a8-6ed7f49e0e3b',
  price: 19218.61,
};

export const sampleWithFullData: IArticle = {
  id: 'd2084642-3fc6-4114-a2ff-828338b1bdcb',
  price: 21848.18,
};

export const sampleWithNewData: NewArticle = {
  price: 2557.9,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
