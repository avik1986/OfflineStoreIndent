import dayjs from 'dayjs/esm';

import { IIntent, NewIntent } from './intent.model';

export const sampleWithRequiredData: IIntent = {
  id: '95efd557-8d0a-4929-ad59-ad929d6c4fb5',
  createdTime: dayjs('2025-07-22T23:40'),
};

export const sampleWithPartialData: IIntent = {
  id: '8eb974ee-c14e-4573-a9d0-6651269a2f74',
  createdTime: dayjs('2025-07-23T06:14'),
  createdBy: 'quit gadzooks burdensome',
  updatedTime: dayjs('2025-07-22T20:59'),
};

export const sampleWithFullData: IIntent = {
  id: '6830892f-868a-43fe-b309-b094fd34debe',
  commission: 7646.66,
  createdTime: dayjs('2025-07-23T11:12'),
  createdBy: 'fen exotic',
  updatedTime: dayjs('2025-07-23T03:59'),
  updatedBy: 'rigidly apropos',
};

export const sampleWithNewData: NewIntent = {
  createdTime: dayjs('2025-07-22T21:11'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
