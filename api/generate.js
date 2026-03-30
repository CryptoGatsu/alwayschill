export default async function handler(req, res) {
  try {
    const { hat, outfit, background } = req.body;

    const prompt = `
Front-facing centered 3D emoji with sunglasses, identical pose and lighting.

Character details:
- Hat: ${hat}
- Outfit: ${outfit}
- Background: ${background}

Style: ultra high quality, glossy 3D, vibrant, clean composition, consistent framing.
`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    res.status(200).json({
      image: `data:image/png;base64,${data.data[0].b64_json}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}