let cache = [];
let isLoading = false;

/* SAFE PRELOAD */
async function preloadImages() {
  if (cache.length >= 2) return;

  try {
    const traits = randomTraits();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(traits)
    });

    const data = await res.json();

    if (data.image) {
      cache.push({ image: data.image, traits });
    }

  } catch (err) {
    console.error("Preload failed:", err);
  }
}

/* GENERATE */
async function generatePFP() {
  if (isLoading) return;
  isLoading = true;

  const bar = document.getElementById("loadingFill");
  bar.innerText = "CHILL...";
  bar.style.width = "30%";

  // ✅ USE CACHE IF AVAILABLE
  if (cache.length > 0) {
    const item = cache.pop();

    showResult(item.image, item.traits);

    preloadImages();
    isLoading = false;
    return;
  }

  const traits = randomTraits();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(traits)
    });

    const data = await res.json();

    if (!data.image) {
      throw new Error("No image");
    }

    showResult(data.image, traits);

    preloadImages();

  } catch (err) {
    console.error(err);
    bar.innerText = "Try Again 😎";
  }

  bar.style.width = "100%";
  isLoading = false;
}

/* SHOW RESULT */
function showResult(image, traits) {
  document.getElementById("pfpImage").src = image;

  document.getElementById("traits").innerHTML = `
    <p>Hat: ${traits.hat}</p>
    <p>Outfit: ${traits.outfit}</p>
    <p>Background: ${traits.background}</p>
  `;

  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";

  const bar = document.getElementById("loadingFill");
  bar.innerText = "DONE 😎";

  setTimeout(() => {
    bar.style.width = "0%";
    bar.innerText = "Generate 😎";
  }, 1500);
}