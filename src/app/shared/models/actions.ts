export interface Actions<T>{
  icon: string;
  toolTip: string;
  label: string;
  actionType: string
  action: (item: T) => void;

}
