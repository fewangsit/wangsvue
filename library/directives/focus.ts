import { nextTick } from 'vue';

/**
 * This directive is used to focus the html input on a component.
 */

const vFocus = {
  mounted: async (el: HTMLElement): Promise<void> => {
    const isInput = el.tagName.toLowerCase() === 'input';
    const isButton = el.tagName.toLowerCase() === 'button';

    nextTick(() => {
      if (isInput || isButton) {
        el.focus();
      } else {
        el.querySelector('input')?.focus();
      }
    });
  },
};

export default vFocus;
