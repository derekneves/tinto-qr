import QRCodeStyling from 'qr-code-styling';
import { PRESETS } from './presets.js';

// ---- State ----
const state = {
  url: 'https://github.com',
  dotType: 'rounded',
  cornerType: 'extra-rounded',
  fg: '#2c2420',
  bg: '#faf8f5',
  accent: '#8b2252',
  useGradient: false,
  gradientEnd: '#e94560',
  gradient: null,
  size: 400,
  ec: 'Q',
  logo: null,
  preset: 0,
};

let qr = null;
let timer = null;
const $ = (s) => document.querySelector(s);

// ---- QR Options ----
function opts() {
  const o = {
    width: state.size,
    height: state.size,
    type: 'canvas',
    data: state.url || 'https://example.com',
    margin: 12,
    qrOptions: { errorCorrectionLevel: state.ec },
    dotsOptions: { type: state.dotType, color: state.fg },
    backgroundOptions: { color: state.bg },
    cornersSquareOptions: { type: state.cornerType, color: state.accent },
    cornersDotOptions: { type: state.cornerType === 'square' ? 'square' : 'dot', color: state.accent },
  };

  if (state.useGradient) {
    o.dotsOptions.gradient = {
      type: 'linear', rotation: 45,
      colorStops: [{ offset: 0, color: state.fg }, { offset: 1, color: state.gradientEnd }],
    };
  } else if (state.gradient) {
    o.dotsOptions.gradient = state.gradient;
  }

  if (state.logo) {
    o.image = state.logo;
    o.imageOptions = { hideBackgroundDots: true, imageSize: 0.35, margin: 6 };
    o.qrOptions.errorCorrectionLevel = 'H'; // ponytail: logo needs max EC to stay scannable
  }
  return o;
}

// ---- Render ----
function render() {
  if (qr) { qr.update(opts()); }
  else { qr = new QRCodeStyling(opts()); $('#qr-canvas').innerHTML = ''; qr.append($('#qr-canvas')); }
}
function debounced() { clearTimeout(timer); timer = setTimeout(render, 80); }

// ---- Presets ----
function renderPresets() {
  const grid = $('#preset-grid');
  grid.innerHTML = '';
  PRESETS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = `preset-btn${i === state.preset ? ' active' : ''}`;
    btn.innerHTML = `<span class="swatch" style="background:${p.swatch}"></span><span class="pname">${p.name}</span>`;
    btn.addEventListener('click', () => applyPreset(i));
    grid.appendChild(btn);
  });
}

function applyPreset(i) {
  const p = PRESETS[i];
  Object.assign(state, {
    preset: i, fg: p.fg, bg: p.bg, accent: p.accent,
    dotType: p.dotType, cornerType: p.cornerType,
    gradient: p.gradient, useGradient: false,
  });
  $('#color-fg').value = p.fg;
  $('#color-bg').value = p.bg;
  $('#color-accent').value = p.accent;
  $('#use-gradient').checked = false;
  updateGradientUI();
  syncRow($('#dot-type-row'), state.dotType);
  syncRow($('#corner-type-row'), state.cornerType);
  $('#preset-grid').querySelectorAll('.preset-btn').forEach((b, j) => b.classList.toggle('active', j === i));
  render();
}

// ---- Option rows ----
function setupRow(row, key) {
  row.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      state[key] = btn.dataset.value;
      syncRow(row, state[key]);
      clearPreset();
      debounced();
    });
  });
}
function syncRow(row, val) {
  row.querySelectorAll('.opt').forEach(b => b.classList.toggle('active', b.dataset.value === val));
}
function clearPreset() {
  state.preset = -1;
  $('#preset-grid').querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
}

// ---- Gradient UI ----
function updateGradientUI() {
  const wrap = $('#gradient-end-wrap');
  const input = $('#color-gradient-end');
  wrap.style.opacity = state.useGradient ? '1' : '0.4';
  input.disabled = !state.useGradient;
}

// ---- Toast ----
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

// ---- Downloads ----
async function download(ext) {
  const tmp = new QRCodeStyling({ ...opts(), type: ext === 'svg' ? 'svg' : 'canvas' });
  const blob = await tmp.getRawData(ext === 'svg' ? 'svg' : 'png');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `tinto-${Date.now()}.${ext}`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`${ext.toUpperCase()} downloaded`);
}

async function copy() {
  try {
    const blob = await qr.getRawData('png');
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    toast('Copied');
  } catch { toast('Copy failed — download instead'); }
}

// ---- Init ----
renderPresets();

$('#qr-url').addEventListener('input', e => { state.url = e.target.value; debounced(); });

setupRow($('#dot-type-row'), 'dotType');
setupRow($('#corner-type-row'), 'cornerType');
setupRow($('#ec-row'), 'ec');

for (const [id, key] of [['#color-fg','fg'], ['#color-bg','bg'], ['#color-accent','accent'], ['#color-gradient-end','gradientEnd']]) {
  $(id).addEventListener('input', e => { state[key] = e.target.value; clearPreset(); debounced(); });
}

$('#use-gradient').addEventListener('change', e => {
  state.useGradient = e.target.checked;
  state.gradient = null;
  updateGradientUI();
  clearPreset();
  debounced();
});

$('#qr-size').addEventListener('input', e => {
  state.size = +e.target.value;
  $('#size-label').textContent = state.size;
  debounced();
});

$('#logo-upload-btn').addEventListener('click', () => $('#logo-input').click());
$('#logo-input').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => { state.logo = ev.target.result; $('#logo-remove-btn').hidden = false; render(); };
  r.readAsDataURL(f);
});
$('#logo-remove-btn').addEventListener('click', () => {
  state.logo = null; $('#logo-input').value = ''; $('#logo-remove-btn').hidden = true; render();
});

$('#download-png').addEventListener('click', () => download('png'));
$('#download-svg').addEventListener('click', () => download('svg'));
$('#copy-btn').addEventListener('click', copy);

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); download('png'); }
});

render();
