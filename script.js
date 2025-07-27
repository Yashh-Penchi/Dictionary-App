document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#search input");
  const searchBtn = document.querySelector("#search i");
  const actualWord = document.getElementById("actualWord");
  const audioMeaning = document.getElementById("audioMeaning");
  const actualMeaningList = document.querySelector("#actualMeaning ul");
  const synonymHeader = document.querySelector("#syenonms h5");
  const audioIcon = document.getElementById("audioIcon");
  const source = document.getElementById("source");

  let audio = null;

  function fetchMeaning(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.title === "No Definitions Found") {
          actualWord.textContent = "Word not found";
          audioMeaning.textContent = "";
          actualMeaningList.innerHTML = "<li>No meaning found.</li>";
          synonymHeader.textContent = "";
          source.innerHTML = "";
          return;
        }

        const entry = data[0];
        actualWord.textContent = entry.word;
        audioMeaning.textContent = entry.phonetic || "";

        // Audio setup
        const audioUrl = entry.phonetics.find(p => p.audio)?.audio || "";
        if (audioUrl) {
          audio = new Audio(audioUrl);
          audioIcon.style.cursor = "pointer";
          audioIcon.onclick = () => audio.play();
        } else {
          audioIcon.style.cursor = "default";
          audioIcon.onclick = null;
        }

        // Meanings
        const definitions = entry.meanings[0]?.definitions || [];
        actualMeaningList.innerHTML = definitions
          .slice(0, 4)
          .map(def => `<li>${def.definition}</li>`)
          .join("");

        // Synonyms
        const synonyms = entry.meanings[0]?.synonyms || [];
        synonymHeader.textContent = synonyms.length ? synonyms.slice(0, 5).join(", ") : "None";

        // Source URL
        const link = entry.sourceUrls?.[0] || "";
        source.innerHTML = link ? `<a href="${link}" target="_blank">${link}</a>` : "";
      })
      .catch(() => {
        actualWord.textContent = "Error";
        actualMeaningList.innerHTML = "<li>Something went wrong.</li>";
        synonymHeader.textContent = "";
        source.innerHTML = "";
      });
  }

  searchBtn.addEventListener("click", function () {
    const word = input.value.trim();
    if (word) fetchMeaning(word);
  });

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const word = input.value.trim();
      if (word) fetchMeaning(word);
    }
  });

  // 🔥 Default word: "God" on page load
  fetchMeaning("God");
});
