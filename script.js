async function loadData() {
  const response = await fetch('data.json');
  const data = await response.json();

  renderAnimals(data.animals);
  renderLocations(data.locations);
  renderCurrentSeason(data.animals);
}

function renderAnimals(animals) {
  const container = document.getElementById('animals');
  animals.forEach(animal => {
    container.innerHTML += `
      <div class="card">
        <img src="${animal.image}" alt="${animal.name}">
        <h3>${animal.name}</h3>
      </div>
    `;
  });
}

function renderLocations(locations) {
  const container = document.getElementById('locations');
  locations.forEach(loc => {
    container.innerHTML += `
      <div class="card">
        <img src="${loc.image}" alt="${loc.name}">
        <h3>${loc.name}</h3>
      </div>
    `;
  });
}

function renderCurrentSeason(animals) {
  const month = new Date().toLocaleString('default', { month: 'long' });
  const container = document.getElementById('season-now');

  animals
    .filter(animal => animal.seasonMonths.includes(month))
    .forEach(animal => {
      container.innerHTML += `
        <div class="card">
          <img src="${animal.image}" alt="${animal.name}">
          <h3>${animal.name}</h3>
          <p>In season this month</p>
        </div>
      `;
    });
}

loadData();
