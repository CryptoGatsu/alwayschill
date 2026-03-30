export default async function handler(req, res) {
  try {
    // ✅ SAFELY PARSE BODY
    let body = {};

    if (req.method === "POST") {
      body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};
    }

    const {
      hat = "cool hat",
      outfit = "futuristic outfit",
      background = "neon background"
    } = body;

    const prompt = `
Front-facing centered 3D emoji with sunglasses, identical pose and lighting.

Hat: ${hat}
Outfit: ${outfit}
Background: ${background}

Ultra high quality, glossy 3D render, vibrant, clean.
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

    // ✅ SAFE CHECK
    if (!data?.data?.[0]?.b64_json) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: "Image generation failed", raw: data });
    }

    return res.status(200).json({
      image: `data:image/png;base64,${data.data[0].b64_json}`
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}