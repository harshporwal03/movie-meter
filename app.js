const btn = document.querySelector(".search-btn");
const input = document.getElementById("input");
const resultContainer = document.querySelector(".result-container");
const result = document.querySelector(".result");

const detailsContainer = document.querySelector(".movie-details-container");

btn.addEventListener("click", async () => {
  if (input.value) {
    await getMovies(input.value);
    resultContainer.style.display = "block";
    document.body.style.height = "100%";
    resultContainer.scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Please enter the name of the movie");
  }
});

async function getMovies(name) {
  const url = `https://api.collectapi.com/imdb/imdbSearchByName?query=${name}`;
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      authorization: "enter api key here",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data);
    const movies = data.result;

    // Clear previous results
    result.innerHTML = "";

    if (!data.result || data.result.length === 0) {
      result.innerHTML = `<p class="error-msg">No movies found for the given search term.</p>`;
      return;
    }

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("card");

      // Set inner HTML of each movie result
      card.innerHTML = `<div class="img-div">
        <img class="poster" src="${
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://media.istockphoto.com/id/827247322/vector/danger-sign-vector-icon-attention-caution-illustration-business-concept-simple-flat-pictogram.jpg?s=612x612&w=0&k=20&c=BvyScQEVAM94DrdKVybDKc_s0FBxgYbu-Iv6u7yddbs="
        }" alt="${movie.Title}"/></div>
        <div class="title-div"><h2 class="movie-title">${movie.Title} (${
        movie.Year
      })</h2></div>
      `;

      result.appendChild(card);

      // Add event listeners for clicking on the image and title
      const poster = card.querySelector(".poster");
      const title = card.querySelector(".movie-title");

      const handleClick = () => {
        const imdb_id = movie.imdbID;
        window.location.href = `movie.html?imdbID=${imdb_id}`;
      };

      poster.addEventListener("click", handleClick);
      title.addEventListener("click", handleClick);
    });

    // Clear the input field after fetching results
    input.value = "";
  } catch (error) {
    console.error(error);
    result.innerHTML = `<p class="error-msg">There was an error fetching movie data. Please try again later.</p>`;
  }
}
