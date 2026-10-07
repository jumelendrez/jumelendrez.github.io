(() => {
  const hero = document.querySelector('.v6-shell');
  if (!hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;

  if (!reduceMotion && finePointer) {
    const scene = hero.querySelector('.v6-scene');
    const portraitRig = hero.querySelector('.v6-portrait-rig');
    const portraitGlow = hero.querySelector('.v6-portrait-glow');

    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      if (scene) {
        scene.style.transform = `translate3d(${nx * -6}px,${ny * -5}px,0)`;
      }
      if (portraitRig) {
        portraitRig.style.marginLeft = `${nx * 4}px`;
      }
      if (portraitGlow) {
        portraitGlow.style.marginLeft = `${nx * 6}px`;
        portraitGlow.style.marginTop = `${ny * 5}px`;
      }
    });

    hero.addEventListener('pointerleave', () => {
      if (scene) scene.style.transform = '';
      if (portraitRig) portraitRig.style.marginLeft = '';
      if (portraitGlow) {
        portraitGlow.style.marginLeft = '';
        portraitGlow.style.marginTop = '';
      }
    });
  }
})();
