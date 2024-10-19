import { ObjectUtils } from 'primevue/utils';

export const FilterMatchMode = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
  IN: 'in',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUAL_TO: 'lte',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUAL_TO: 'gte',
  DATE_BETWEEN: 'dateBetween',
  DATE_BEFORE: 'dateBefore',
  DATE_AFTER: 'dateAfter',
};

type FilterFunction = (
  value: any,
  filter: any,
  filterLocale?: string,
) => boolean;

class FilterService {
  private readonly filters: { [key: string]: FilterFunction };

  constructor() {
    this.filters = {
      contains: this.contains,
      dateBetween: this.dateBetween,
      in: this.in,
      lt: this.lt,
      lte: this.lte,
      gt: this.gt,
      gte: this.gte,
    };
  }

  filter(
    value: any[],
    fields: string[],
    filterValue: any,
    filterMatchMode: string,
    filterLocale?: string,
  ): any[] {
    const filteredItems: any[] = [];

    if (!value) {
      return filteredItems;
    }

    for (const item of value) {
      if (typeof item === 'string') {
        if (this.filters[filterMatchMode](item, filterValue, filterLocale)) {
          filteredItems.push(item);
        }
      }
      {
        for (const field of fields) {
          const fieldValue = ObjectUtils.resolveFieldData(item, field);

          if (
            this.filters[filterMatchMode](fieldValue, filterValue, filterLocale)
          ) {
            filteredItems.push(item);
            break;
          }
        }
      }
    }

    return filteredItems;
  }

  register(rule: string, fn: FilterFunction): void {
    this.filters[rule] = fn;
  }

  private contains(
    value: any,
    filter: any,
    filterLocale: string = 'en',
  ): boolean {
    if (filter === undefined || filter === null || filter === '') {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    const filterValue = ObjectUtils.removeAccents(
      filter.toString(),
    ).toLocaleLowerCase(filterLocale);
    const stringValue = ObjectUtils.removeAccents(
      value.toString(),
    ).toLocaleLowerCase(filterLocale);

    return stringValue.indexOf(filterValue) !== -1;
  }

  private dateBetween(value: any, filter: [Date, Date]): boolean {
    if (filter == null || filter[0] == null || filter[1] == null) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    if (value.getTime)
      return (
        filter[0].getTime() <= value.getTime() &&
        value.getTime() <= filter[1].getTime()
      );
    return filter[0] <= value && value <= filter[1];
  }

  private in(value: any, filter: any[]): boolean {
    if (filter === undefined || filter === null || filter.length === 0) {
      return true;
    }

    for (let i = 0; i < filter.length; i++) {
      if (ObjectUtils.equals(value, filter[i])) {
        return true;
      }
    }

    return false;
  }

  private lt(value: any, filter: any): boolean {
    if (filter === undefined || filter === null) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    if (value.getTime && filter.getTime)
      return value.getTime() < filter.getTime();
    return value < filter;
  }

  private lte(value: any, filter: any): boolean {
    if (filter === undefined || filter === null) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    if (value.getTime && filter.getTime)
      return value.getTime() <= filter.getTime();
    return value <= filter;
  }

  private gt(value: any, filter: any): boolean {
    if (filter === undefined || filter === null) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    if (value.getTime && filter.getTime)
      return value.getTime() > filter.getTime();
    return value > filter;
  }

  private gte(value: any, filter: any): boolean {
    if (filter === undefined || filter === null) {
      return true;
    }

    if (value === undefined || value === null) {
      return false;
    }

    if (value.getTime && filter.getTime)
      return value.getTime() >= filter.getTime();
    return value >= filter;
  }
}

export default new FilterService();
