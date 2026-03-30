let cache = [];

async function preloadImages() {
  for (let i = 0; i < 3; i++) {
    const traits = randomTraits();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(traits)
    });

    const data = await res.json();

    cache.push({ image: data.image, traits });
  }
}

// preload on page load
preloadImages();

async function generatePFP() {
  const bar = document.getElementById("loadingFill");

  // INSTANT if cached
  if (cache.length > 0) {
    const item = cache.pop();

    document.getElementById("pfpImage").src = item.image;
    document.getElementById("traits").innerHTML = `
      <p>Hat: ${item.traits.hat}</p>
      <p>Outfit: ${item.traits.outfit}</p>
      <p>Background: ${item.traits.background}</p>
    `;

    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";

    preloadImages(); // refill cache
    return;
  }

  // fallback if empty
  bar.innerText = "CHILL...";
}