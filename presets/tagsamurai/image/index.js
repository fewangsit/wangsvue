export default {
  root: ({ props }) => ({
    class: [
      'relative inline-block',
      'shrink-0',
      { 'rounded-full': props.rounded },
      { 'rounded-lg': !props.rounded },
    ],
  }),
  image: ({ props }) => ({
    class: [
      'w-full h-full object-cover',
      { 'rounded-full': props.rounded },
      { 'rounded-lg': !props.rounded },
    ],
  }),
  button: {
    class: [
      'flex items-center justify-center',
      'absolute',
      'w-full h-full',
      'inset-0 opacity-0 transition-opacity duration-300',
      'bg-transparent text-white',
      'hover:cursor-pointer hover:bg-grayscale-900 hover:opacity-50',
    ],
    style: 'border-radius: inherit',
  },
  icon: {
    class: 'w-6 h-6',
  },
  mask: {
    class: [
      'flex items-center justify-center',
      'fixed top-0 left-0',
      'w-full h-full',
      'bg-grayscale-950/90',
    ],
  },
  toolbar: {
    class: ['flex', 'absolute top-0 right-0', 'p-4'],
  },
  rotaterightbutton: {
    class: [
      'z-20',
      'flex justify-center items-center',
      'w-6 h-6',
      'mr-2',
      'rounded-full',
      'text-white bg-transparent',
      'hover:text-white hover:bg-white/10',
      'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50',
      'transition duration-200 ease-in-out',
    ],
  },
  rotaterighticon: {
    class: 'w-4 h-4',
  },
  rotateleftbutton: {
    class: [
      'z-20',
      'flex justify-center items-center',
      'w-6 h-6',
      'mr-2',
      'rounded-full',
      'text-white bg-transparent',
      'hover:text-white hover:bg-white/10',
      'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50',
      'transition duration-200 ease-in-out',
    ],
  },
  rotatelefticon: {
    class: 'w-4 h-4',
  },
  zoomoutbutton: {
    class: [
      'z-20',
      'flex justify-center items-center',
      'w-6 h-6',
      'mr-2',
      'rounded-full',
      'text-white bg-transparent',
      'hover:text-white hover:bg-white/10',
      'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50',
      'transition duration-200 ease-in-out',
    ],
  },
  zoomouticon: {
    class: 'w-4 h-4',
  },
  zoominbutton: {
    class: [
      'z-20',
      'flex justify-center items-center',
      'w-6 h-6',
      'mr-2',
      'rounded-full',
      'text-white bg-transparent',
      'hover:text-white hover:bg-white/10',
      'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50',
      'transition duration-200 ease-in-out',
    ],
  },
  zoominicon: {
    class: 'w-4 h-4',
  },
  closebutton: {
    class: [
      'z-20',
      'flex justify-center items-center',
      'w-6 h-6',
      'mr-2',
      'rounded-full',
      'text-white bg-transparent',
      'hover:text-white hover:bg-white/10',
      'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50',
      'transition duration-200 ease-in-out',
    ],
  },
  closeicon: {
    class: 'w-4 h-4',
  },
  transition: {
    enterFromClass: 'opacity-0 scale-75',
    enterActiveClass: 'transition-all duration-150 ease-in-out',
    leaveActiveClass: 'transition-all duration-150 ease-in',
    leaveToClass: 'opacity-0 scale-75',
  },
};
