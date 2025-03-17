const form = document.querySelector("#form");

const fetchShows = async (query) => {
  try {
    const response = await axios.get("https://api.tvmaze.com/search/shows", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    alert("There was an error fetching TV shows. Please try again later.");
    return null;
  }
};

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const saveFavorites = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const displayFavorites = () => {
  const favContainer = document.querySelector(".favorites-container");
  favContainer.innerHTML = "";
  favorites.forEach((show) => {
    const favCard = document.createElement("div");
    favCard.classList.add("fav-card");
    favCard.innerHTML = `<h2>${show.name}</h2>
      <p>Type: ${show.type}</p>
      <p>Language: ${show.language}</p>`;
    favContainer.appendChild(favCard);
  });
};

const addFavorite = (show) => {
  if (!favorites.find((fav) => fav.id === show.id)) {
    favorites.push(show);
    saveFavorites();
    alert(`${show.name} added to favorites!`);
  } else {
    alert(`${show.name} is already in favorites!`);
  }
};

const displayImages = (shows) => {
  const container = document.querySelector(".results-container");
  container.innerHTML = ""; // Clear previous results
  if (Array.isArray(shows)) {
    shows.forEach(({ show }) => {
      const card = document.createElement("div");
      card.classList.add("show-card");
      if (show.image) {
        const img = document.createElement("img");
        img.src = show.image.medium;
        card.appendChild(img);
      }
      const title = document.createElement("h2");
      title.textContent = show.name;
      card.appendChild(title);

      // New details container for additional info
      const details = document.createElement("div");
      details.classList.add("show-details");

      // Removed unordered list styles; now using separate paragraphs for each detail
      const typeP = document.createElement("p");
      typeP.textContent = `Type: ${show.type}`;
      details.appendChild(typeP);

      const languageP = document.createElement("p");
      languageP.textContent = `Language: ${show.language}`;
      details.appendChild(languageP);

      const genresP = document.createElement("p");
      genresP.textContent = `Genres: ${show.genres.join(", ")}`;
      details.appendChild(genresP);

      const statusP = document.createElement("p");
      statusP.textContent = `Status: ${show.status}`;
      details.appendChild(statusP);

      const runtimeP = document.createElement("p");
      runtimeP.textContent = `Runtime: ${show.runtime}`;
      details.appendChild(runtimeP);

      const premieredP = document.createElement("p");
      premieredP.textContent = `Premiered: ${show.premiered}`;
      details.appendChild(premieredP);

      // Display official site if available
      if (show.officialSite) {
        const site = document.createElement("p");
        site.innerHTML = `Official Site: <a href="${show.officialSite}" target="_blank">${show.officialSite}</a>`;
        details.appendChild(site);
      }

      // Display rating and weight
      const rating = document.createElement("p");
      rating.textContent = `Rating: ${show.rating.average || "N/A"} | Weight: ${
        show.weight
      }`;
      details.appendChild(rating);

      // Display web channel if available
      if (show.webChannel && show.webChannel.name) {
        const webChannel = document.createElement("p");
        webChannel.textContent = `WebChannel: ${show.webChannel.name}`;
        details.appendChild(webChannel);
      }

      // Display summary (as HTML)
      if (show.summary) {
        const summary = document.createElement("div");
        summary.innerHTML = show.summary;
        details.appendChild(summary);
      }

      const favBtn = document.createElement("button");
      favBtn.textContent = "Add to Favorites";
      favBtn.classList.add("add-favorite");
      favBtn.addEventListener("click", () => addFavorite(show));
      card.appendChild(favBtn);

      card.appendChild(details);
      container.appendChild(card);
    });
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  const query = input.value.trim();

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  const shows = await fetchShows(query);
  if (shows) {
    displayImages(shows);
  }
  form.reset();
});

// Tab switching functionality
const tabTv = document.getElementById("tab-tv");
const tabDad = document.getElementById("tab-dad");
const tabFav = document.getElementById("tab-fav");
const tvSection = document.getElementById("tv-search");
const dadSection = document.getElementById("dad-jokes");
const favoritesSection = document.getElementById("favorites");

// Initialize: show TV search, hide Dad Jokes
tvSection.style.display = "block";
dadSection.style.display = "none";
favoritesSection.style.display = "none";

tabTv.addEventListener("click", () => {
  // Toggle active state
  tabTv.classList.add("active");
  tabDad.classList.remove("active");
  tabFav.classList.remove("active");
  // Show tv section, hide dad jokes
  tvSection.style.display = "block";
  dadSection.style.display = "none";
  favoritesSection.style.display = "none";
});

tabDad.addEventListener("click", () => {
  // Toggle active state
  tabDad.classList.add("active");
  tabTv.classList.remove("active");
  tabFav.classList.remove("active");
  // Show dad jokes, hide tv section
  dadSection.style.display = "block";
  tvSection.style.display = "none";
  favoritesSection.style.display = "none";
});

tabFav.addEventListener("click", () => {
  tabFav.classList.add("active");
  tabTv.classList.remove("active");
  tabDad.classList.remove("active");
  favoritesSection.style.display = "block";
  tvSection.style.display = "none";
  dadSection.style.display = "none";
  displayFavorites();
});

// Dad jokes functionality
const jokeBtn = document.getElementById("joke-btn");
const jokeText = document.getElementById("joke-text");

const fetchDadJoke = async () => {
  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" },
    });
    return response.data.joke;
  } catch (error) {
    console.error("Error fetching dad joke:", error);
    return "Oops! Couldn't fetch a joke right now.";
  }
};

jokeBtn.addEventListener("click", async () => {
  jokeText.textContent = "Loading...";
  const joke = await fetchDadJoke();
  jokeText.textContent = joke;
});
