import {Actions} from './actions';


export interface Column<T>{
  header: string;
  field?: keyof T;
  columnType?: string;
  actions?: Actions<T>[]
}
