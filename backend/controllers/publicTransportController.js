// publicTransportController.js
import axios from "axios";

export const getNearbyPublicTransport = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Koordinaten fehlen" });
  }

  const query = `
    [out:json];
    node
      [public_transport=platform]
      (around:1000,${lat},${lon});
    out body;
  `;

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const stops = response.data.elements.map((el) => ({
      _id: el.id,
      name: el.tags.name || "Haltestelle",
      lat: el.lat,
      lon: el.lon,
      wheelchair: el.tags.wheelchair === "yes",
    }));

    res.json(stops);
  } catch (err) {
    console.error("🚨 Overpass-Fehler:", err.message);
    res.status(500).json({ message: "Fehler beim Abrufen der Haltestellen." });
  }
};
