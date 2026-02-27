import { animals, states, featuredStates, getSeasonWindow } from './data.js';

const page = document.body.dataset.page;

if (page === 'home') buildHome();
if (page === 'choose') buildChoose();
if (page === 'season') buildSeason();

function buildHome() {
  const track = document.getElementById('animal-scroll-track');
  const repeated = [...animals, ...animals];
  repeated.forEach((animal) => {
    track.appendChild(buildAnimalCard(animal, true));
  });

  const topRow = document.getElementById('top-states-row');
  featuredStates.forEach((code) => {
    const state = states.find((s) => s.code === code);
    topRow.appendChild(buildStateChip(state, `choose.html?mode=state&state=${code}`));
  });

  const plusBtn = document.createElement('button');
  plusBtn.className = 'state-chip plus-chip';
  plusBtn.textContent = '+';
  plusBtn.setAttribute('aria-label', 'Open all states');
  topRow.appendChild(plusBtn);

  const dialog = document.getElementById('all-states-dialog');
  const closeBtn = document.getElementById('close-states-dialog');
  const allStatesGrid = document.getElementById('all-states-grid');

  states.forEach((state) => {
    const link = document.createElement('a');
    link.className = 'state-grid-item';
    link.href = `choose.html?mode=state&state=${state.code}`;
    link.textContent = `${state.name} (${state.code})`;
    allStatesGrid.appendChild(link);
  });

  plusBtn.addEventListener('click', () => dialog.showModal());
  closeBtn.addEventListener('click', () => dialog.close());
}

function buildChoose() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || 'animal';
  const chosenAnimal = params.get('animal');
  const chosenState = params.get('state');

  const title = document.getElementById('choose-title');
  const helper = document.getElementById('choose-helper');
  const grid = document.getElementById('chooser-grid');

  if (mode === 'animal' && !chosenAnimal) {
    title.textContent = 'Step 1: Pick an Animal';
    helper.textContent = 'After this, you will choose a state.';
    animals.forEach((animal) => {
      const card = buildAnimalCard(animal, false, `choose.html?mode=animal&animal=${animal.id}`);
      grid.appendChild(card);
    });
    return;
  }

  if (mode === 'animal' && chosenAnimal) {
    const animal = animals.find((a) => a.id === chosenAnimal);
    title.textContent = `Step 2: Pick a State for ${animal?.name || 'this animal'}`;
    helper.textContent = 'Top states first. Tap + to view all 50 states.';

    const stateRow = document.createElement('div');
    stateRow.className = 'top-states-row';
    featuredStates.forEach((code) => {
      const state = states.find((s) => s.code === code);
      stateRow.appendChild(buildStateChip(state, `season.html?animal=${chosenAnimal}&state=${code}`));
    });

    const plusBtn = document.createElement('button');
    plusBtn.className = 'state-chip plus-chip';
    plusBtn.textContent = '+';
    stateRow.appendChild(plusBtn);

    const allGrid = document.createElement('div');
    allGrid.className = 'all-states-grid hidden';
    states.forEach((state) => {
      const link = document.createElement('a');
      link.className = 'state-grid-item';
      link.href = `season.html?animal=${chosenAnimal}&state=${state.code}`;
      link.textContent = `${state.name} (${state.code})`;
      allGrid.appendChild(link);
    });

    plusBtn.addEventListener('click', () => allGrid.classList.toggle('hidden'));
    grid.append(stateRow, allGrid);
    return;
  }

  if (mode === 'state' && !chosenState) {
    title.textContent = 'Step 1: Pick a State';
    helper.textContent = 'After this, you will choose an animal.';
    states.forEach((state) => {
      grid.appendChild(buildStateChip(state, `choose.html?mode=state&state=${state.code}&pickAnimal=1`, true));
    });
    return;
  }

  if (mode === 'state' && chosenState) {
    const state = states.find((s) => s.code === chosenState);
    title.textContent = `Step 2: Pick an Animal for ${state?.name || chosenState}`;
    helper.textContent = 'Choose an animal to view season status.';
    animals.forEach((animal) => {
      const link = `season.html?animal=${animal.id}&state=${chosenState}`;
      grid.appendChild(buildAnimalCard(animal, false, link));
    });
  }
}

function buildSeason() {
  const params = new URLSearchParams(window.location.search);
  const animalId = params.get('animal');
  const stateCode = params.get('state');

  const animal = animals.find((a) => a.id === animalId);
  const state = states.find((s) => s.code === stateCode);
  const target = document.getElementById('season-result');

  if (!animal || !state) {
    target.innerHTML = `<h3>Missing selection</h3><p>Please choose an animal and state first.</p>`;
    return;
  }

  const season = getSeasonWindow(animalId, stateCode);
  const summary = getSeasonSummary(season.start, season.end);

  target.innerHTML = `
    <p class="kicker">${state.name} • ${animal.name}</p>
    <h3 class="status ${summary.inSeason ? 'in' : 'out'}">${summary.inSeason ? 'In Season' : 'Out of Season'}</h3>
    <p class="big-line">${summary.message}</p>
    <p class="subtle">Demo season window: ${formatDate(season.start)} to ${formatDate(season.end)}</p>
  `;
}

function buildAnimalCard(animal, compactScroll, hrefOverride) {
  const el = hrefOverride ? document.createElement('a') : document.createElement('button');
  if (hrefOverride) el.href = hrefOverride;
  el.className = `animal-card ${compactScroll ? 'scroll-card' : ''}`;
  el.innerHTML = `
    <div class="animal-icon">${animal.icon}</div>
    <p>${animal.name}</p>
  `;

  if (!hrefOverride) {
    el.type = 'button';
    el.addEventListener('click', () => {
      window.location.href = `choose.html?mode=animal&animal=${animal.id}`;
    });
  }
  return el;
}

function buildStateChip(state, href, inGrid = false) {
  const link = document.createElement('a');
  link.className = inGrid ? 'state-grid-item' : 'state-chip';
  link.href = href;
  link.textContent = inGrid ? `${state.name} (${state.code})` : state.name;
  return link;
}

function getSeasonSummary(startMMDD, endMMDD) {
  const now = new Date();
  const start = nextDate(startMMDD, now);
  const end = closestEnd(startMMDD, endMMDD, now);

  if (now >= start && now <= end) {
    const daysLeft = Math.ceil((end - now) / 86400000);
    return { inSeason: true, message: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in season.` };
  }

  const opens = now < start ? start : nextDate(startMMDD, new Date(now.getFullYear() + 1, 0, 1));
  const daysToOpen = Math.ceil((opens - now) / 86400000);
  return { inSeason: false, message: `Season opens in ${daysToOpen} day${daysToOpen === 1 ? '' : 's'}.` };
}

function nextDate(mmdd, fromDate) {
  const [m, d] = mmdd.split('-').map(Number);
  let candidate = new Date(fromDate.getFullYear(), m - 1, d);
  if (candidate < new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())) {
    candidate = new Date(fromDate.getFullYear() + 1, m - 1, d);
  }
  return candidate;
}

function closestEnd(startMMDD, endMMDD, now) {
  const [sm, sd] = startMMDD.split('-').map(Number);
  const [em, ed] = endMMDD.split('-').map(Number);
  const startThisYear = new Date(now.getFullYear(), sm - 1, sd);
  const endThisYear = new Date(now.getFullYear(), em - 1, ed);

  // If season crosses year boundary.
  if (endThisYear < startThisYear) {
    if (now >= startThisYear) return new Date(now.getFullYear() + 1, em - 1, ed);
    return endThisYear;
  }

  return now <= endThisYear ? endThisYear : new Date(now.getFullYear() + 1, em - 1, ed);
}

function formatDate(mmdd) {
  const [m, d] = mmdd.split('-').map(Number);
  return new Date(2025, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
