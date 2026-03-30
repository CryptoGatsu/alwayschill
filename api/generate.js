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

    if (!data.data || !data.data[0]?.b64_json) {
      throw new Error("No image returned");
    }

    // Convert base64 to usable image
    const imageBase64 = data.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    res.status(200).json({ image: imageUrl });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}