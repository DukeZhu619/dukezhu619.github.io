(() => {
  'use strict';

  const journey = document.querySelector('[data-launch-at]');
  if (!journey) return;
  const launchedAt = Date.parse(journey.dataset.launchAt);
  if (!Number.isFinite(launchedAt)) return;
  const runtime = journey.querySelector('.site-runtime');
  const output = journey.querySelector('[data-runtime]');
  const pad = value => String(value).padStart(2, '0');

  const update = () => {
    const elapsed = Math.max(0, Math.floor((Date.now() - launchedAt) / 1000));
    const days = Math.floor(elapsed / 86400);
    const hours = Math.floor(elapsed % 86400 / 3600);
    const minutes = Math.floor(elapsed % 3600 / 60);
    const seconds = elapsed % 60;
    output.textContent = `${days} 天 ${pad(hours)} 小时 ${pad(minutes)} 分 ${pad(seconds)} 秒`;
    runtime.hidden = false;
  };

  update();
  setInterval(update, 1000);
})();
