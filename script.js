// 🌙 Dark mode toggle met onthouden in localStorage
const toggle = document.getElementById('themeToggle');

// Check of gebruiker eerder dark mode aanzette
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Toggle dark mode en sla op in localStorage
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const API_URL = 'https://bruxellesdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/stations-villo-bruxelles-rbc/records?limit=20';
let allLocations = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let userCoords = null;

async function fetchLocations() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allLocations = data.results;
    populateFilterOptions();
    renderLocations();
    renderFavorites();
  } catch (err) {
    document.getElementById('locations').innerHTML = '<p>Data momenteel niet beschikbaar.</p>';
  }
}

function populateFilterOptions() {
  const uniqueMunicipalities = [...new Set(allLocations.map(loc => loc.mu_nl))];
  const filter = document.getElementById('filter');
  uniqueMunicipalities.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    filter.appendChild(opt);
  });
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function renderLocations() {
  const filterValue = document.getElementById('filter').value;
  const sortValue = document.getElementById('sort').value;
  let list = [...allLocations];

  if (filterValue) {
    list = list.filter(loc => loc.mu_nl === filterValue);
  }

  if (sortValue === 'name') {
    list.sort((a, b) => a.name_nl.localeCompare(b.name_nl));
  } else if (sortValue === 'distance' && userCoords) {
    list.forEach(loc => {
      const dist = getDistance(userCoords.lat, userCoords.lon, loc.geo_point_2d.lat, loc.geo_point_2d.lon);
      loc.distance = dist;
    });
    list.sort((a, b) => a.distance - b.distance);
  }

  const container = document.getElementById('locations');
  container.innerHTML = '';

  list.forEach(loc => {
    const div = document.createElement('div');
    div.className = 'location';
    div.innerHTML = `
      <h3>${loc.name_nl}</h3>
      <p><strong>Adres:</strong> ${loc.address_nl || 'Onbekend'}</p>
      <p><strong>Gemeente:</strong> ${loc.mu_nl}</p>
      <p><strong>Status:</strong> ${loc.status}</p>
      <a href="${loc.google_maps}" target="_blank">Bekijk op kaart</a><br>
      <button onclick='addFavorite(${JSON.stringify(loc)})'>Toevoegen aan favorieten</button>
    `;
    container.appendChild(div);
    setTimeout(() => div.classList.add('visible'), 50);
  });
}

function addFavorite(loc) {
  if (!favorites.some(f => f.villo_id === loc.villo_id)) {
    favorites.push(loc);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
  }
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f.villo_id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

function renderFavorites() {
  const container = document.getElementById('favoriteList');
  container.innerHTML = '';
  favorites.forEach(loc => {
    const div = document.createElement('div');
    div.className = 'location';
    div.innerHTML = `
      <h4>${loc.name_nl}</h4>
      <p>${loc.address_nl || 'Onbekend'} (${loc.mu_nl})</p>
      <button onclick='removeFavorite("${loc.villo_id}")'>Verwijder uit favorieten</button>
    `;
    container.appendChild(div);
    
    // Zorg dat de favoriet ook zichtbaar wordt
    setTimeout(() => div.classList.add('visible'), 50);
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    userCoords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
    renderLocations(); // update sortering zodra locatie bekend is
  });
}
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

function renderFeedback() {
  const container = document.getElementById('feedbackList');
  container.innerHTML = '';
  feedbacks.forEach((text, index) => {
    const div = document.createElement('div');
    div.className = 'location';
    div.innerHTML = `
      <p>${text}</p>
      <button class="removeFeedback" onclick="removeFeedback(${index})">Verwijder</button>
    `;
    container.appendChild(div);
    setTimeout(() => div.classList.add('visible'), 50);
  });
}

function removeFeedback(index) {
  feedbacks.splice(index, 1);
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  renderFeedback();
}

document.getElementById('feedbackForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('feedbackInput');
  const text = input.value.trim();
  const message = document.getElementById('feedbackMessage');
  
  if (text) {
    feedbacks.push(text);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    input.value = '';
    renderFeedback();

    // Toon bevestigingsbericht
    message.style.display = 'block';

    // Verberg het bericht automatisch na 3 seconden (optioneel)
    setTimeout(() => {
      message.style.display = 'none';
    }, 3000);
  }
});
document.getElementById('filter').addEventListener('change', renderLocations);
document.getElementById('sort').addEventListener('change', renderLocations);

fetchLocations();
renderFeedback();