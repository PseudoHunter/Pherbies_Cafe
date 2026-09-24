/**
 * Smoothly scrolls to a target section by element ID with header offset and visual transition feedback.
 */
export const smoothScrollTo = (targetId: string, customOffset: number = 80): void => {
  // If target is top or home
  if (!targetId || targetId === '#' || targetId === 'top') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    return;
  }

  const cleanId = targetId.replace(/^#/, '');
  const element = document.getElementById(cleanId);

  if (!element) {
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - customOffset;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: 'smooth',
  });

  // Optional subtle glow/highlight effect to confirm arrival
  element.classList.remove('section-highlight');
  // Trigger DOM reflow to restart animation if clicked repeatedly
  void element.offsetWidth;
  element.classList.add('section-highlight');

  // Update hash without abrupt jump
  try {
    window.history.pushState(null, '', `#${cleanId}`);
  } catch {
    // Ignore in restricted iframe contexts
  }
};
