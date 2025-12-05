import { MouseEvent } from 'react';

export const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
  e.preventDefault();
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    window.history.pushState(null, '', hash);
  }
};
