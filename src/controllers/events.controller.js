import axios from "axios";

export const getevents = async (req, res) => {
  try {
    console.log("Fetching events...");

    const response = await axios.get(
      "https://eonet.gsfc.nasa.gov/api/v3/events/geojson"
    );

    const events = response.data.features.map((event) => ({
      title: event.properties.title,
      date: event.properties.date,
      geometry: event.geometry,
      sources: event.properties.sources,
      categories: event.properties.categories,
    }));

    return res.status(200).json({
      success: true,
      message: "Events Found",
      total: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// export const floodindiaone = async (req, res) => {
export const floodindiaone = async (req, res) => {
  try {
    const response = await axios.get(
      "https://eonet.gsfc.nasa.gov/api/v3/events/geojson/india-floods"
    );
    const events = response.data.features.map((event) => ({
      title: event.properties.title,
      date: event.properties.date,
      geometry: event.geometry,
      sources: event.properties.sources,
      categories: event.properties.categories,
    }));
    return res.status(200).json({
      success: true,
      message: "Events Found",
      total: events.length,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
