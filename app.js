'use strict';

const models = [
  { key: 'dense', name: 'Dense' },
  { key: 'full', name: 'Full Loop' },
  { key: 'asym', name: 'AsymLoop' },
];
let resultData;
let selectedShot = 'zero';

function renderResults() {
  if (!resultData) return;
  const scale = document.querySelector('#scale-select').value;
  const values = resultData.scales[scale][selectedShot];
  const setting = selectedShot === 'zero' ? 'Zero-shot' : 'Five-shot';
  document.querySelector('#comparison-bars').innerHTML = models.map(({ key, name }) => {
    const accuracy = values[key][7];
    return `<div class="bar-row"><span class="bar-name">${name}</span><div class="bar-track"><div class="bar-fill ${key}" style="width:${accuracy}%"></div></div><span class="bar-number">${accuracy.toFixed(2)}<span class="sr-only"> percent</span></span></div>`;
  }).join('');
  document.querySelector('#callout-label').textContent = `${scale} · ${setting.toUpperCase()}`;
  const gain = values.asym[7] - values.full[7];
  document.querySelector('#result-gain').innerHTML = `+${gain.toFixed(2)}<span>pp</span>`;
  document.querySelector('#task-caption').textContent = `${scale} ${setting.toLowerCase()} accuracy, percent`;
  const bestValues = Array.from({ length: 8 }, (_, column) => Math.max(...models.map(({ key }) => values[key][column])));
  document.querySelector('#task-rows').innerHTML = models.map(({ key, name }) => `<tr><th scope="row">${name}</th>${values[key].map((value, column) => `<td${value === bestValues[column] ? ' class="best"' : ''}>${value.toFixed(2)}</td>`).join('')}</tr>`).join('');
}

document.querySelector('#scale-select').addEventListener('change', renderResults);
document.querySelectorAll('[data-shot]').forEach(button => {
  button.addEventListener('click', () => {
    selectedShot = button.dataset.shot;
    document.querySelectorAll('[data-shot]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderResults();
  });
});

// Fetching JSON keeps the downloadable artifact and the displayed results identical.
fetch('assets/results.json').then(response => {
  if (!response.ok) throw new Error('Could not load results');
  return response.json();
}).then(data => {
  resultData = data;
  renderResults();
}).catch(() => {
  document.querySelector('#comparison-bars').innerHTML = '<p class="data-note">Interactive results could not load. <a href="assets/results.json">Open the results data</a> or see the scaling figure above.</p>';
});

document.querySelectorAll('[data-k]').forEach(button => {
  button.addEventListener('click', () => {
    const count = Number(button.dataset.k);
    document.querySelectorAll('[data-k]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#round-count').textContent = count;
    document.querySelector('#loop-count').textContent = count;
    document.querySelectorAll('.iteration').forEach((item, index) => item.classList.toggle('active', index < count));
    document.querySelectorAll('.extra').forEach(item => item.classList.toggle('hidden', count < 5));
  });
});

const figureDialog = document.querySelector('#figure-dialog');
let figureTrigger;
document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    figureTrigger = button;
    const figure = document.querySelector('#enlarged-figure');
    figure.src = button.dataset.figure;
    figure.alt = button.querySelector('img').alt;
    document.querySelector('#figure-dialog-caption').textContent = button.dataset.caption;
    figureDialog.showModal();
    document.body.classList.add('no-scroll');
  });
});
document.querySelector('#close-figure').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', event => {
  if (event.target === figureDialog) {
    const rect = figureDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) figureDialog.close();
  }
});
figureDialog.addEventListener('close', () => {
  document.body.classList.remove('no-scroll');
  if (figureTrigger) figureTrigger.focus();
});

if ('IntersectionObserver' in window) {
  const navigation = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('#method, #results, #analysis').forEach(section => observer.observe(section));
}
