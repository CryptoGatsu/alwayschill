export async function GET() {
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
      return new Response(JSON.stringify({ error: "No image returned" }), {
        status: 500
      });
    }

    const image = `data:image/png;base64,${data.data[0].b64_json}`;

    return new Response(JSON.stringify({ image }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    });
  }
}