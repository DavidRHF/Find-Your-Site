const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

document.querySelectorAll('form[data-demo-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const notice = form.querySelector('.notice');
    if (notice) {
      notice.style.display = 'block';
      notice.textContent = 'Thanks! This demo form is ready to connect to your email, CRM, or Google Form endpoint.';
    }
    form.reset();
  });
});

document.querySelectorAll('.faq-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    if (panel) {
      panel.classList.toggle('open');
      const icon = btn.querySelector('strong');
      if (icon) icon.textContent = panel.classList.contains('open') ? '–' : '+';
    }
  });
});

function softBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .14);
    osc.start();
    osc.stop(ctx.currentTime + .15);
  } catch (e) {}
}

// Discount spinner: result always matches the segment the wheel lands on.
const spinBtn = document.querySelector('#spinBtn');
const wheel = document.querySelector('#discountWheel');
const result = document.querySelector('#discountResult');
let rotation = 0;
const discounts = ['5% Off', '7% Off', '10% Off', '12% Off', '15% Off', '20% Off', '$25 Off', '$50 Off'];
if (spinBtn && wheel && result) {
  spinBtn.addEventListener('click', () => {
    spinBtn.disabled = true;
    result.textContent = 'Spinning...';

    const index = Math.floor(Math.random() * discounts.length);
    const segment = 360 / discounts.length;
    const segmentCenter = index * segment + segment / 2;
    const pointerAngle = 0;
    const current = ((rotation % 360) + 360) % 360;
    const targetRotation = 360 * 6 + pointerAngle - segmentCenter;
    rotation += targetRotation - current;

    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
      result.innerHTML = `<span>You landed on:</span> <strong>${discounts[index]}</strong>`;
      softBeep();
      spinBtn.disabled = false;
    }, 4200);
  });
}

// Lead fishing game: cast the line, wait for fish to swim under the hook, then click the fish.
const castLeadBtn = document.querySelector('#castLeadBtn');
const restartLeadBtn = document.querySelector('#restartLeadBtn');
const restartLeadBtnModal = document.querySelector('#restartLeadBtnModal');
const viewCaughtBtn = document.querySelector('#viewCaughtBtn');
const caughtList = document.querySelector('#caughtList');
const catchCount = document.querySelector('#catchCount');
const leadGameStatus = document.querySelector('#leadGameStatus');
const fishingStage = document.querySelector('.fishing-stage');
const fishTargets = document.querySelectorAll('.fish');
const hook = document.querySelector('.hook');
const leadModal = document.querySelector('#leadModal');
const closeLeadModal = document.querySelector('#closeLeadModal');
const leadSummary = document.querySelector('#leadSummary');

const mockLeads = [
  {business:'Maple Street Bakery', need:'Needs a cleaner menu page and online order buttons', area:'Downtown family shop', urgency:'Warm lead'},
  {business:'Iron Oak Landscaping', need:'Website is missing service areas, gallery photos, and quote form', area:'Suburban service route', urgency:'High potential'},
  {business:'Cornerstone Barber Co.', need:'Needs booking links, reviews, and stronger mobile layout', area:'Main street storefront', urgency:'Ready soon'},
  {business:'Northside Auto Repair', need:'No clear emergency contact path or service breakdown', area:'Local garage district', urgency:'Strong fit'},
  {business:'Little Lantern Daycare', need:'Needs trust-focused copy, parent FAQs, and tour request form', area:'Family neighborhood', urgency:'Nurture lead'},
  {business:'Riverbend Yoga Studio', need:'Class schedule is hard to update and hard to read on phones', area:'Wellness district', urgency:'Warm lead'},
  {business:'Summit Roofing Crew', need:'Needs storm-damage landing page and quote funnel', area:'Regional contractor', urgency:'High potential'},
  {business:'Cedar Pet Grooming', need:'Needs before-and-after gallery and appointment request form', area:'Local plaza', urgency:'Ready soon'}
];

let caughtLeads = [];
let lineIsCast = false;
let castTimer = null;

function renderCaughtLeads() {
  if (!caughtList || !catchCount) return;
  catchCount.textContent = caughtLeads.length;
  caughtList.innerHTML = '';
  if (caughtLeads.length === 0) {
    caughtList.innerHTML = '<li class="empty-catch">No leads caught yet. Cast the line, then click a fish when it swims under the hook.</li>';
    return;
  }
  caughtLeads.forEach((lead, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${index + 1}. ${lead.business}</strong><span>${lead.need}</span><span>${lead.area} • ${lead.urgency}</span>`;
    caughtList.appendChild(li);
  });
}

function setFishPaused(paused) {
  fishTargets.forEach(fish => fish.classList.toggle('paused', paused));
}

function overlapsHook(fish) {
  if (!hook) return false;
  const fishRect = fish.getBoundingClientRect();
  const hookRect = hook.getBoundingClientRect();
  const buffer = 22;
  return !(
    fishRect.right < hookRect.left - buffer ||
    fishRect.left > hookRect.right + buffer ||
    fishRect.bottom < hookRect.top - buffer ||
    fishRect.top > hookRect.bottom + buffer
  );
}

function resetLeadGame() {
  caughtLeads = [];
  lineIsCast = false;
  clearTimeout(castTimer);
  renderCaughtLeads();
  setFishPaused(false);
  if (fishingStage) fishingStage.classList.remove('casting', 'ready-to-catch', 'missed-catch');
  if (castLeadBtn) {
    castLeadBtn.disabled = false;
    castLeadBtn.textContent = 'Cast the line';
  }
  if (viewCaughtBtn) viewCaughtBtn.disabled = true;
  if (leadGameStatus) leadGameStatus.innerHTML = '<strong>Ready to cast?</strong> Catch 5 mock leads to finish the round. Cast your line, then click a moving fish when it passes the hook.';
  if (leadModal) {
    leadModal.classList.remove('open');
    leadModal.setAttribute('aria-hidden', 'true');
  }
}

function openLeadModal() {
  if (!leadModal || !leadSummary) return;
  leadSummary.innerHTML = `<div class="lead-summary-grid">${caughtLeads.map(lead => `<div class="lead-summary-card"><h3>${lead.business}</h3><p><strong>Need:</strong> ${lead.need}</p><p><strong>Area:</strong> ${lead.area}</p><p><strong>Status:</strong> ${lead.urgency}</p></div>`).join('')}</div>`;
  leadModal.classList.add('open');
  leadModal.setAttribute('aria-hidden', 'false');
}

function finishCast(message) {
  lineIsCast = false;
  clearTimeout(castTimer);
  if (fishingStage) fishingStage.classList.remove('casting', 'ready-to-catch');
  if (castLeadBtn && caughtLeads.length < 5) {
    castLeadBtn.disabled = false;
    castLeadBtn.textContent = 'Cast again';
  }
  if (leadGameStatus && message) leadGameStatus.innerHTML = message;
}

function catchFish(fish) {
  if (!lineIsCast || caughtLeads.length >= 5) return;

  if (!overlapsHook(fish)) {
    if (leadGameStatus) leadGameStatus.innerHTML = '<strong>Almost!</strong> The fish has to be under the hook. Wait for it to swim into the line, then click.';
    fish.classList.add('missed-pop');
    setTimeout(() => fish.classList.remove('missed-pop'), 350);
    return;
  }

  const remaining = mockLeads.filter(lead => !caughtLeads.some(caught => caught.business === lead.business));
  const lead = remaining[Math.floor(Math.random() * remaining.length)];
  caughtLeads.push(lead);
  renderCaughtLeads();
  softBeep();
  fish.classList.add('caught-pop');
  setTimeout(() => fish.classList.remove('caught-pop'), 450);

  if (caughtLeads.length >= 5) {
    finishCast('<strong>Round complete!</strong> You caught 5 mock leads. View the catches or restart the game.');
    setFishPaused(true);
    if (castLeadBtn) {
      castLeadBtn.disabled = true;
      castLeadBtn.textContent = 'Round complete';
    }
    if (viewCaughtBtn) viewCaughtBtn.disabled = false;
  } else {
    finishCast(`<strong>Caught ${lead.business}!</strong> ${5 - caughtLeads.length} more lead${5 - caughtLeads.length === 1 ? '' : 's'} to go.`);
  }
}

if (castLeadBtn) {
  renderCaughtLeads();
  fishTargets.forEach((fish, index) => {
    fish.setAttribute('role', 'button');
    fish.setAttribute('tabindex', '0');
    fish.setAttribute('aria-label', `Catch fish ${index + 1}`);
    fish.addEventListener('click', () => catchFish(fish));
    fish.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        catchFish(fish);
      }
    });
  });

  castLeadBtn.addEventListener('click', () => {
    if (caughtLeads.length >= 5 || lineIsCast) return;
    lineIsCast = true;
    castLeadBtn.disabled = true;
    if (fishingStage) fishingStage.classList.add('casting', 'ready-to-catch');
    if (leadGameStatus) leadGameStatus.innerHTML = '<strong>Line cast!</strong> Time the click. Catch a fish when it swims under the hook.';
    castTimer = setTimeout(() => {
      if (lineIsCast) finishCast('<strong>Missed the catch.</strong> Cast again and time your click when a fish passes the hook.');
    }, 6500);
  });
}

if (viewCaughtBtn) viewCaughtBtn.addEventListener('click', openLeadModal);
if (restartLeadBtn) restartLeadBtn.addEventListener('click', resetLeadGame);
if (restartLeadBtnModal) restartLeadBtnModal.addEventListener('click', resetLeadGame);
if (closeLeadModal) closeLeadModal.addEventListener('click', () => {
  if (leadModal) {
    leadModal.classList.remove('open');
    leadModal.setAttribute('aria-hidden', 'true');
  }
});
