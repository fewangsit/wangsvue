import { DropdownOption } from 'lib/types/options.type';

const filterOptions = (
  options?: DropdownOption[] | string[],
): DropdownOption[] | string[] => {
  if (!options) return [];

  if (typeof options[0] === 'string') {
    return options as string[];
  }
  return (options as DropdownOption[]).filter(
    (option) => option.visible !== false,
  );
};

export default filterOptions;
