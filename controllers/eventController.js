const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary"); // ✅ add this

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    let brochureUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "dsc-events",
  resource_type: "auto",
  use_filename: true,       // ✅ keeps original name
  unique_filename: false    // ✅ prevents random name
});   // ✅ important fix


      brochureUrl = result.secure_url; // ✅ store cloudinary URL
    }

    const newEvent = new Event({
      title,
      description,
      date,
      image: brochureUrl, // ✅ updated
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully" });

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Event operation failed" });
  }
};

// GET EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const updatedData = {
      title,
      description,
      date,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "dsc-events",
  resource_type: "raw",
  use_filename: true,
  unique_filename: false,
});

const fileUrl = result.secure_url + "." + result.format;

updatedData.brochure = fileUrl; // ✅ updated
    }

    await Event.findByIdAndUpdate(req.params.id, updatedData);

    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
};