let map;
let tempUnit = "F";
let selectedCity = null;
let selectedCountry = null;

function debounce(fn, delay) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), delay);
  };
}

document
  .getElementById("city")
  .addEventListener("input", debounce(loadAutocomplete, 300));

document.getElementById("searchBtn").addEventListener("click", exploreCity);

async function loadAutocomplete() {
  const q = document.getElementById("city").value.trim();
  const box = document.getElementById("autocomplete-list");
  box.innerHTML = "";

  if (q.length < 2) {
    box.style.display = "none";
    return;
  }

  const res = await fetch(
    "https://geodb-free-service.wirefreethought.com/v1/geo/cities?" +
      new URLSearchParams({ namePrefix: q, limit: 10, sort: "-population" })
  );

  const data = await res.json();
  const list = data.data;
  if (!list.length) {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  list.forEach((item) => {
    const display = `${item.city}, ${item.region}, ${item.country}`;
    const div = document.createElement("div");
    div.className = "autocomplete-item";
    div.textContent = display;
    div.onclick = () => {
      document.getElementById("city").value = display;
      selectedCity = item.city;
      selectedCountry = item.country;
      box.style.display = "none";
    };
    box.appendChild(div);
  });
}

async function exploreCity() {
  const input = document.getElementById("city").value.trim();
  if (!input) return;

  if (!selectedCity || !selectedCountry) {
    const parts = input.split(",");
    selectedCity = parts[0].trim();
    selectedCountry = parts[parts.length - 1].trim();
  }

  const place = await smartGeoLookup(selectedCity, selectedCountry);
  if (!place) {
    document.getElementById("photoSection").innerHTML = "";
    document.getElementById("weatherSection").innerHTML =
      "<div class='weather-box'>City not found.</div>";
    document.getElementById("descriptionSection").innerHTML = "";
    document.getElementById("attractionSection").innerHTML = "";
    return;
  }

  const lat = place.lat;
  const lon = place.lon;

  const weather = await getWeather(lat, lon);
  const emoji = weatherIcon(weather.code);
  const flag = countryFlag(place.country || selectedCountry);

  const photo = await getWikipediaPhoto(place.name);
  const description = await getWikipediaDescription(place.name);
  const attractions = await getAttractions(lat, lon);

  document.getElementById("photoSection").innerHTML = photo
    ? `<img src="${photo}" class="hero-img">`
    : "";

  document.getElementById("weatherSection").innerHTML = `
    <h2>Weather in ${place.name} ${flag}</h2>
    <div class="weather-temp">${formatTemp(weather.temp)}°${tempUnit}</div>
    <div class="weather-desc">${emoji} ${weather.desc}</div>
    <button id="switchTemp">Switch to ${tempUnit === "F" ? "C" : "F"}</button>
  `;

  setupTempToggle(weather.temp);

  document.getElementById("descriptionSection").innerHTML = `
    <h2>City Overview</h2>
    <p>${description}</p>
  `;

  renderHighlights(attractions);
  showMap(lat, lon, place.name);

  selectedCity = place.name;
}

async function smartGeoLookup(city, country) {
  const attempts = [
    `${city}, ${country}`,
    `${city}, ${country}, United States`,
    `${city}, USA`,
    city,
  ];

  for (const q of attempts) {
    const r = await fetch(
      "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({
          q,
          format: "json",
          addressdetails: 1,
          limit: 1,
        }),
      {
        headers: { "User-Agent": "TravelExplorerApp", "Accept-Language": "en" },
      }
    );

    const d = await r.json();

    if (d.length) {
      return {
        name: d[0].display_name.split(",")[0],
        lat: d[0].lat,
        lon: d[0].lon,
        country: d[0].address?.country,
      };
    }
  }

  return null;
}

function countryFlag(c) {
  const f = {
    "United States": "🇺🇸",
    Canada: "🇨🇦",
    Mexico: "🇲🇽",
    France: "🇫🇷",
    Germany: "🇩🇪",
    Italy: "🇮🇹",
    Spain: "🇪🇸",
    Australia: "🇦🇺",
    "United Kingdom": "🇬🇧",
    Ireland: "🇮🇪",
    Brazil: "🇧🇷",
  };
  return f[c] || "";
}

function weatherIcon(code) {
  const i = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    51: "🌧️",
    61: "🌧️",
    71: "❄️",
    95: "⛈️",
  };
  return i[code] || "🌍";
}

function setupTempToggle(k) {
  document.getElementById("switchTemp").onclick = () => {
    tempUnit = tempUnit === "F" ? "C" : "F";
    document.querySelector(".weather-temp").textContent =
      formatTemp(k) + "°" + tempUnit;
    document.getElementById("switchTemp").textContent =
      "Switch to " + (tempUnit === "F" ? "C" : "F");
  };
}

function formatTemp(k) {
  return tempUnit === "F"
    ? Math.round(((k - 273.15) * 9) / 5 + 32)
    : Math.round(k - 273.15);
}

async function getWeather(lat, lon) {
  const r = await fetch(
    "https://api.open-meteo.com/v1/forecast?" +
      new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,weather_code",
      })
  );
  const d = await r.json();
  const kelvin = d.current.temperature_2m + 273.15;
  return {
    temp: kelvin,
    desc: weatherDesc(d.current.weather_code),
    code: d.current.weather_code,
  };
}

function weatherDesc(code) {
  const m = {
    0: "Clear",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    51: "Drizzle",
    61: "Rain",
    71: "Snow",
    95: "Thunderstorms",
  };
  return m[code] || "Unavailable";
}

async function getWikipediaPhoto(city) {
  try {
    const r = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(city)
    );
    const d = await r.json();
    return d.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function getWikipediaDescription(city) {
  try {
    const r = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(city)
    );
    const d = await r.json();

    if (d.description && d.description.toLowerCase().includes("may refer")) {
      return "No description available.";
    }

    return d.extract || "No description available.";
  } catch {
    return "No description available.";
  }
}

async function getAttractions(lat, lon) {
  try {
    const r = await fetch(
      "https://overpass-api.de/api/interpreter?data=[out:json];(" +
        `node["tourism"](around:7000,${lat},${lon});` +
        `way["tourism"](around:7000,${lat},${lon});` +
        `relation["tourism"](around:7000,${lat},${lon}););out;`
    );
    const d = await r.json();

    const invalidTypes = [
      "apartment",
      "apartments",
      "house",
      "building",
      "yes",
    ];
    const unique = new Set();

    return d.elements
      .map((e) => ({
        name: e.tags.name || "",
        type: e.tags.tourism || "",
      }))
      .filter((e) => e.name && !invalidTypes.includes(e.type))
      .filter((e) => {
        if (unique.has(e.name)) return false;
        unique.add(e.name);
        return true;
      })
      .slice(0, 5);
  } catch {
    return [];
  }
}

function renderHighlights(list) {
  if (!list.length) {
    document.getElementById("attractionSection").innerHTML =
      "<p>No major attractions found.</p>";
    return;
  }

  const emojis = {
    museum: "🖼️",
    gallery: "🏛️",
    attraction: "⭐",
    artwork: "🎨",
    zoo: "🦁",
    information: "ℹ️",
    viewpoint: "🔭",
  };

  const items = list
    .map(
      (a) =>
        `<li><strong>${a.name}</strong><br>${capitalize(a.type)} ${
          emojis[a.type] || ""
        }</li>`
    )
    .join("");

  document.getElementById("attractionSection").innerHTML = `
    <h2>City Highlights</h2>
    <ul class="attraction-list">${items}</ul>
  `;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showMap(lat, lon, label) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 12);
  } else {
    map.setView([lat, lon], 12);
  }
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  L.marker([lat, lon]).addTo(map).bindPopup(label);
}
