import { AsyncLocalStorage } from 'async_hooks';
import { IRequestContextData } from './RequestContextData.interface';

export const requestContext = new AsyncLocalStorage<IRequestContextData>();
