const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Patient = require("../model/patient/patient");

const BASE_UPLOAD_PATH = "G:/Patients";
let speciality;
// Configure multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const { id, idacte } = req.params;
      const { service, acte } = req.body;
      speciality = acte;
      // Fetch the patient details from the database
      const patient = await Patient.findById(id);
      if (!patient || !patient.fullname) {
        return cb(new Error("Patient name is required or patient not found"));
      }

      // Sanitize patient name to avoid invalid paths
      //   const sanitizedFullName = patient.fullname.replace(
      //     /[^a-zA-Z0-9-_ ]/g,
      //     ""
      //   );
      const consultation = patient.consultation.find(
        (c) => c._id.toString() === idacte
      );
      if (!consultation || !consultation.date) {
        return cb(new Error("Consultation date is required"), null);
      }

      // Extract the year from the consultation date
      const consultationYear = new Date(consultation.date).getFullYear();

      // Construct the directory path
      const patientPath = path.join(BASE_UPLOAD_PATH, patient.fullname);
      const yearPath = path.join(patientPath, consultationYear.toString());
      const servicePath = path.join(yearPath, service);
      const actePath = path.join(servicePath, acte);

      // Create the directories recursively
      fs.mkdirSync(actePath, { recursive: true });

      cb(null, actePath);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${speciality}-${file.originalname}-${uniqueSuffix}`);
  },
});

// Multer middleware for file uploads
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific file types
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed.")
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
