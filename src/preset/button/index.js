export default {
  root: ({ props, context, parent }) => ({
    class: [
      'relative items-center justify-center inline-flex text-center',
      'text-xs h-[26px] w-max min-w-[26px]',
      // Icons position
      {
        'gap-1': props.icon && props.label,
        'flex-row-reverse': props.iconPos === 'right',
      },
      {
        'px-3 py-[7.6px] min-w-[26px]':
          props.size === null && props.label !== null,
        'px-2 py-1': props.size === 'small',
        'px-3 py-2': props.size === 'large',
      },
      {
        'w-[26px] p-0': props.label == null,
      },

      'ring-inset',

      // Shapes
      {
        'shadow-sm': !props.raised && !props.link && !props.text,
        'shadow-lg': props.raised,
      },
      { 'rounded': !props.rounded, 'rounded-full': props.rounded },
      {
        'rounded-none first:rounded-l-md last:rounded-r-md self-center':
          parent.instance.$name == 'InputGroup',
      },

      // Link Button
      { 'text-primary-600 bg-transparent ring-transparent': props.link },

      // Plain Button
      {
        'text-white bg-gray-500 ring-1 ring-gray-500':
          props.plain && !props.outlined && !props.text,
      },
      // Plain Text Button
      { 'text-surface-500': props.plain && props.text },
      // Plain Outlined Button
      {
        'text-surface-500 ring-1 ring-gray-500': props.plain && props.outlined,
      },

      // Text Button
      { 'bg-transparent ring-transparent': props.text && !props.plain },

      // Outlined Button
      { 'bg-transparent': props.outlined && !props.plain },

      // --- Severity Buttons ---

      // Primary Button
      {
        'text-white dark:!text-primary-800':
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.disabled &&
          !context.disabled &&
          !props.plain,
        'bg-primary dark:bg-primary-300':
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-primary dark:ring-primary-300 focus-visible:bg-primary-600 focus-visible:ring-primary-600':
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Primary Text Button
      {
        'text-primary dark:text-primary-300 dark:hover:bg-primary-900':
          props.text && props.severity === null && !props.plain,
      },
      // Primary Outlined Button
      {
        'text-primary dark:text-primary-300 ring-1 ring-primary hover:bg-primary-bg-weak dark:hover:bg-primary-900 focus-visible:bg-primary-50':
          props.outlined && props.severity === null && !props.plain,
      },

      // Secondary Button
      {
        'text-surface-0 dark:text-surface-0':
          props.severity === 'secondary' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'bg-general-500 dark:bg-general-500':
          props.severity === 'secondary' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-general-500 dark:ring-general-500 focus-visible:bg-general-600 focus-visible:ring-general-600':
          props.severity === 'secondary' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Secondary Text Button
      {
        'text-general-500 dark:text-white':
          props.text && props.severity === 'secondary' && !props.plain,
      },
      // Secondary Outlined Button
      {
        'text-general-500 dark:text-white ring-1 ring-general-500 dark:ring-white':
          props.outlined && props.severity === 'secondary' && !props.plain,
      },

      // Success Button
      {
        'text-white dark:!text-success-900':
          props.severity === 'success' &&
          !props.text &&
          !props.outlined &&
          !props.disabled &&
          !context.disabled &&
          !props.plain,
        'bg-success dark:bg-success-300':
          props.severity === 'success' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-success dark:ring-success-300 focus-visible:bg-success-600 focus-visible:ring-success-600':
          props.severity === 'success' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Success Text Button
      {
        'text-success dark:text-success-300':
          props.text && props.severity === 'success' && !props.plain,
      },
      // Success Outlined Button
      {
        'text-success ring-1 ring-success focus-visible:bg-success-50':
          props.outlined && props.severity === 'success' && !props.plain,
      },

      // Info Button
      {
        'text-white dark:text-white':
          props.severity === 'info' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'bg-info dark:bg-info':
          props.severity === 'info' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-info dark:ring-info focus-visible:bg-info-strong focus-visible:ring-info-strong':
          props.severity === 'info' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Info Text Button
      {
        'text-info dark:text-info':
          props.text && props.severity === 'info' && !props.plain,
      },
      // Info Outlined Button
      {
        'text-info ring-1 ring-info hover:bg-info-bg-weak focus-visible:bg-info-bg-weak':
          props.outlined && props.severity === 'info' && !props.plain,
      },

      // Warning Button
      {
        'text-white dark:text-white':
          props.severity === 'warning' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'bg-warning dark:bg-warning':
          props.severity === 'warning' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-warning dark:ring-warning':
          props.severity === 'warning' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Warning Text Button
      {
        'text-warning dark:text-warning':
          props.text && props.severity === 'warning' && !props.plain,
      },
      // Warning Outlined Button
      {
        'text-warning ring-1 ring-warning hover:bg-warning-bg-weak focus-visible:bg-warning-50':
          props.outlined && props.severity === 'warning' && !props.plain,
      },

      // Dark Button
      {
        'text-white dark:!text-general-900':
          props.severity === 'dark' &&
          !props.text &&
          !props.outlined &&
          !props.disabled &&
          !context.disabled &&
          !props.plain,
        'bg-general-900 dark:bg-general-50':
          props.severity === 'dark' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-general-900 dark:ring-general-50':
          props.severity === 'dark' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Dark Text Button
      {
        'text-general-900 dark:text-general-50':
          props.text && props.severity === 'dark' && !props.plain,
      },
      // Dark Outlined Button
      {
        'text-general-900 dark:text-general-50 ring-1 ring-general-900 dark:ring-general-50':
          props.outlined && props.severity === 'dark' && !props.plain,
      },

      // Danger Button
      {
        'text-white dark:!text-danger-800':
          props.severity === 'danger' &&
          !props.text &&
          !props.outlined &&
          !props.disabled &&
          !context.disabled &&
          !props.plain,
        'bg-danger dark:bg-danger-200':
          props.severity === 'danger' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
        'ring-1 ring-danger dark:ring-danger-200 focus-visible:bg-danger-600 focus-visible:ring-danger-600':
          props.severity === 'danger' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Danger Text Button
      {
        'text-danger dark:text-danger-200':
          props.text && props.severity === 'danger' && !props.plain,
      },
      // Danger Outlined Button
      {
        'text-danger dark:text-danger-200 ring-1 ring-danger dark:ring-danger-200 hover:bg-danger-bg-weak focus-visible:bg-danger-50':
          props.outlined && props.severity === 'danger' && !props.plain,
      },

      // --- Severity Button States ---
      {
        'focus-visible:ring-offset-0':
          !props.link && !props.plain && !props.outlined && !props.text,
      },

      // Link
      {
        'focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400':
          props.link,
      },

      // Plain
      {
        'hover:bg-gray-600 hover:ring-gray-600':
          props.plain && !props.outlined && !props.text,
      },
      // Text & Outlined Button
      {
        'hover:bg-surface-300/20':
          props.plain && (props.text || props.outlined),
      },

      // Primary
      {
        'hover:bg-primary-strong dark:hover:bg-primary-400 hover:ring-primary-strong dark:hover:ring-primary-400':
          !props.link &&
          props.severity === null &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        'hover:bg-primary-bg-weak':
          (props.text || props.outlined) &&
          props.severity === null &&
          !props.plain,
      },

      {
        'focus-visible:ring-1 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-600':
          props.severity === null,
      },

      // Secondary
      {
        'hover:bg-general-600 dark:hover:bg-general-600 hover:ring-general-600 dark:hover:ring-general-600':
          props.severity === 'secondary' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // {
      //   'focus-visible:ring-1 focus-visible:ring-  'focus-visible:ring-50:dark:ring-1 focus-visible:dark:general-600':
      //     props.severity === 'secondary',
      // },
      // Text & Outlined Button
      {
        'hover:bg-surface-300/20':
          (props.text || props.outlined) &&
          props.severity === 'secondary' &&
          !props.plain,
      },

      // Success
      {
        'hover:bg-success-strong dark:hover:bg-success-400 hover:ring-success-strong dark:hover:ring-success-400':
          props.severity === 'success' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        'hover:bg-success-bg-weak dark:hover:bg-success-900':
          (props.text || props.outlined) &&
          props.severity === 'success' &&
          !props.plain,
      },

      {
        'focus-visible:ring-1 focus-visible:ring-success-600 dark:focus-visible:ring-success-600':
          props.severity === 'success',
      },

      // Info
      {
        'hover:bg-info-strong dark:hover:bg-info-strong hover:ring-info-strong dark:hover:ring-info-strong':
          props.severity === 'info' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      {
        'focus-visible:ring-1 focus-visible:ring-info-strong dark:focus-visible:ring-info-strong':
          props.severity === 'info',
      },
      // Text & Outlined Button
      {
        'hover:bg-blue-300/20':
          (props.text || props.outlined) &&
          props.severity === 'info' &&
          !props.plain,
      },

      // Warning
      {
        'hover:bg-warning-strong dark:hover:bg-warning-strong hover:ring-warning-strong dark:hover:ring-warning-strong focus-visible:bg-warning-600 focus-visible:ring-warning-600':
          props.severity === 'warning' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      // Text & Outlined Button
      {
        'hover:bg-orange-300/20':
          (props.text || props.outlined) &&
          props.severity === 'warning' &&
          !props.plain,
      },

      {
        'focus-visible:ring-1 focus-visible:ring-warning-600 focus-visible:ring-warning-600 dark:focus-visible:ring-warning-600':
          props.severity === 'warning',
      },

      // Dark
      {
        'hover:bg-general-800 hover:ring-general-800 dark:hover:ring-general-100 dark:hover:bg-general-100':
          props.severity === 'dark' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      {
        'focus-visible:bg-general-50 dark:focus-visible:bg-general-50':
          props.severity === 'dark' && props.outlined,
      },
      {
        'focus-visible:ring-1 focus-visible:ring-general-600 dark:focus-visible:ring-general-600':
          props.severity === 'dark',
      },
      {
        'focus-visible:bg-general-600 dark:focus-visible:bg-general-600':
          props.severity === 'dark' && !props.outlined && !props.text,
      },
      // Text & Outlined Button
      {
        'hover:bg-surface-100 dark:hover:bg-general-900':
          (props.text || props.outlined) &&
          props.severity === 'dark' &&
          !props.plain,
      },

      // Danger
      {
        'hover:bg-danger-strong dark:hover:bg-danger-300 hover:ring-danger-strong dark:hover:ring-danger-300':
          props.severity === 'danger' &&
          !props.text &&
          !props.outlined &&
          !props.plain,
      },
      {
        'focus-visible:ring-1 focus-visible:ring-danger-600 dark:focus-visible:ring-danger-600':
          props.severity === 'danger',
      },
      // Text & Outlined Button
      {
        'hover:bg-red-300/20 dark:hover:bg-danger-900':
          (props.text || props.outlined) &&
          props.severity === 'danger' &&
          !props.plain,
      },

      // Disabled
      {
        '!text-general-200 !pointer-events-none !cursor-default':
          context.disabled || props.disabled,
      },

      // Filled Disabled
      {
        '!text-white !bg-general-200 !ring-1 !ring-general-200 !dark:text-white !dark:bg-general-200':
          (context.disabled || props.disabled) &&
          !props.outlined &&
          !props.plain &&
          !props.text,
      },
      // Outlined Disabled
      {
        '!ring-1 !ring-offset-0 !ring-general-200':
          (props.disabled || context.disabled) && props.outlined,
      },

      // Transitions
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer overflow-hidden select-none',
    ],
  }),
  label: ({ props }) => ({
    class: [
      'duration-200',
      'whitespace-nowrap',
      'font-medium',
      'tracking-[0.24px]',
      'leading-3',
      {
        '!text-[8.86px] tracking-[0.03em]': props.size === 'small',
      },
      {
        'hover:underline': props.link,
      },
      { 'flex-1': props.label !== null, 'invisible w-0': props.label == null },
    ],
  }),
  icon: ({ props }) => ({
    class: [
      'mx-0',
      {
        'mr-1': props?.iconPos == 'left' && props?.label != null,
        'ml-1 order-1': props.iconPos == 'right' && props?.label != null,
        'mb-1': props?.iconPos == 'top' && props?.label != null,
        'mt-1': props?.iconPos == 'bottom' && props?.label != null,
      },
      {
        '!text-[8.86px] tracking-[0.03em]': props?.size === 'small',
      },
    ],
  }),
  loadingicon: ({ props }) => ({
    class: [
      'h-3 w-3',
      'mx-0',
      {
        'mr-2': props.iconPos == 'left' && props.label != null,
        'ml-2 order-1': props.iconPos == 'right' && props.label != null,
        'mb-2': props.iconPos == 'top' && props.label != null,
        'mt-2': props.iconPos == 'bottom' && props.label != null,
      },
      'animate-spin',
    ],
  }),
  badge: ({ props }) => ({
    class: [
      {
        'ml-2 w-4 h-4 leading-none flex items-center justify-center':
          props.badge,
      },
    ],
  }),
};
