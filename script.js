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
