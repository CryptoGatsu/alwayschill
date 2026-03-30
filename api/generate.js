export default async function handler(req, res) {
  try {
    let body = {};

    if (req.method === "POST") {
      body = typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};
    }

    const {
      hair = "Spiky Punk Hair, Long Wavy Locks, Curly Afro, Braided Dreadlocks, Samurai Topknot, Rainbow Dyed Undercut, Messy Bedhead, Buzz Cut with Lightning Bolt, Flaming Mohawk, Cowboy Stetson, Victorian Top Hat, Neon Beanie, Viking Horned Helmet, Golden Crown, Wizard Pointed Hat, Pirate Tricorn, Angel Halo, Demon Horns, Cyberpunk Visor Helmet, Las Vegas Feather Headdress",
      outfit = "Leather Jacket Collar, Oversized Hoodie, Chainmail Gorget, Full Plate Armor Neckpiece, Tuxedo Bowtie & Collar, Hawaiian Shirt Open Collar, Fur-Lined Cape, Mystic Cloak Hood, Bandolier Straps, Thick Gold Chains, Silk Scarf, Superhero Cape Clasp, Steampunk Vest, Samurai Armor Pauldrons, Crypto Hoodie Neckline",
      background = "Solid Neon Grid, Blockchain Matrix Code, Enchanted Forest Mist, Deep Space Nebula, Las Vegas Strip Lights, Fiery Lava Glow, Icy Arctic Aurora, Cyber City Rain, Underwater Bubbles, Golden Desert Dunes, Fantasy Castle Sky, Rainbow Pixel Explosion, Dark Meme Void, Jungle Canopy, Retro Arcade Glow",
      pose = "Cool Side Glance, Confident Arms Crossed, Smug Head Tilt, Peace Sign Hand, Pointing Forward, Thumbs Up, Victory Hand Gesture, Hand on Chin Thinking, Winking, Tongue Out, Middle Finger, Shushing Finger, Flexing Bicep, Dabbing Pose, Sunglasses Adjustment, Front Pose",
    // 🔥 MUCH BETTER PROMPT
    } = body;

    const prompt = `
A high-quality 3D render of the 😎 emoji character.

Core identity:
- Round yellow emoji face
- Black sunglasses (consistent across all generations)
- Smooth glossy material
- Same face every time

Pose:
${pose}

Appearance:
- Hair / Headwear: ${hair}
- Clothing / Neck detail: ${outfit}

Background:
${background}

Style:
- Ultra clean 3D render
- Centered composition
- Soft cinematic lighting
- Vibrant but balanced colors
- No distortion, no extra limbs
- Consistent character design
- Meme coin aesthetic

Make it look like a premium collectible avatar.
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

    if (!data?.data?.[0]?.b64_json) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        error: "Image generation failed",
        raw: data
      });
    }

    return res.status(200).json({
      image: `data:image/png;base64,${data.data[0].b64_json}`
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}