let CONFIG = {
  pumpfun: "",
  dexscreener: "",
  contract: ""
};

export default async function handler(req, res) {

  // GET config
  if (req.method === "GET") {
    return res.status(200).json(CONFIG);
  }

  // UPDATE config (basic protection)
  if (req.method === "POST") {
    const { pumpfun, dexscreener, contract, password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "unauthorized" });
    }

    CONFIG = { pumpfun, dexscreener, contract };

    return res.status(200).json({ success: true });
  }
}