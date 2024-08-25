export default function (event: Event): void {
  let el = event.target as HTMLElement;

  if (el.tagName === 'UL') {
    el = el.parentElement as HTMLElement;
  }

  const { offsetHeight = 0 } = el;
  const maxHeight = (window.innerHeight * 90) / 100;

  if (offsetHeight >= maxHeight) {
    el.style.transform = 'translateY(5vh)'; // Make the menu verticaly centered
  }
}
