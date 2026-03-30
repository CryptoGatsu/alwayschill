export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: "Front-facing centered 3D emoji with sunglasses, identical pose, random outfit and background, ultra HD",
        size: "512x512"
      })
    });

    const data = await response.json();

    if (!data.data || !data.data[0]) {
      throw new Error("No image returned");
    }

    res.status(200).json({ image: data.data[0].url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}