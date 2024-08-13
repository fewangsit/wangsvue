import { DefineComponent } from 'vue';

export interface ButtonFilterProps {
  showFilter?: boolean;
}

export type ButtonFilterEmits = {
  'update:showFilter': [state: boolean];
};

declare const ButtonFilter: DefineComponent<
  ButtonFilterProps,
  ButtonFilterEmits
>;

export default ButtonFilter;
