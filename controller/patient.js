const fs = require("fs");
const Pdfmake = require("pdfmake");
// Define font files
var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};

const moment = require("moment");
const Staff = require("../model/staff");

const Patient = require("../model/patient");

module.exports.listepatient = async (req, res) => {
  const medecins = await Staff.find({ fonction: "Medecin" });
  const techniciens = await Staff.find({ fonction: "technicien" });
  // res.send(medecins)
  const patients = await Patient.find({});
  res.render("patient/index", { patients, moment, medecins, techniciens });
};
module.exports.creationform = async (req, res) => {
  const medecins = await Staff.find({ fonction: "Medecin" });
  res.render("patient/new", { medecins });
};
module.exports.showpatient = async (req, res) => {
  // get the patient id from the patients table
  const { id } = req.params;
  const medecins = await Staff.find({ fonction: "Medecin" });
  const techniciens = await Staff.find({ fonction: "technicien" });
  // find the patient in the database
  const patient = await Patient.findById(id);
  // send it to the client
  res.render("patient/show", { patient, moment, medecins, techniciens });
  // res.send(patient)
};

module.exports.createpatient = async (req, res) => {
  var { firstname, lastname, birthdate, gender, medecinref, phone } =
    req.body.patient;

  const patient = new Patient({
    firstname,
    lastname,
    birthdate,
    phone,
    medecinref,
    gender,
  });
  await patient.save();
  req.flash("success", "Patient ajouté avec succès");
  res.redirect("/patient");
};
module.exports.createandreturn = async (req, res) => {
  var { firstname, lastname, birthdate, gender, medecinref, phone } =
    req.body.patient;

  const patient = new Patient({
    firstname,
    lastname,
    birthdate,
    phone,
    medecinref,
    gender,
  });
  await patient.save();
  req.flash("success", "Patient ajouté avec succès");
  res.redirect("/patient/new");
};

module.exports.showEditForm = async (req, res) => {
  res.render("patient/edit");
};
module.exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { patient } = req.body;

  await Patient.findByIdAndUpdate(id, { ...patient }, { new: true });
  req.flash("success", "Patient a été modifié avec succès");
  res.redirect("back");
};
module.exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Patient.findByIdAndDelete(id);
  req.flash("success", "Patient a été supprimé");
  res.redirect("/patient");
};

module.exports.generatepdf = async (req, res) => {
  const patients = await Patient.find({});
  let pdfmake = new Pdfmake(fonts);
  let listTableDocs = {
    header:{
      image: "public/assets/en-tete.png",width:580,height:100, margin: [20,10,20,80],
    },
    content: [
      // { image: "public/assets/en-tete.png"},
      {
        text: "Liste Des Patients",
        style: "header",
      },
    ],
    // Define styles
    styles: {
      header: {
        fontSize: 25,
        bold: true,
        alignment: "center",
        margin: [0, 150, 0, 20],
      },
      subheader: {
        fontSize: 12,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [30, 10, 30, 10],
        color: "#4caf82",
      },
      tableHeader: { bold: true, fontSize: 13, color: "#4caf82" },
      table: {
        fontSize: 11,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [0, 10, 0, 10],
        color: "#061e30",
      },
      text: {
        alignment: "justify",
      },
      link: {
        decoration: "underline",
        color: "#0074c1",
      },
    },
  };
  let table = {
    // headers are automatically repeated if the table spans over multiple pages
    // you can declare how many rows should be treated as headers
    headerRows: 1,
    // widths:number of columns in the table here we have 8 columns
    widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],

    body: [
      [
        {
          text: "N°",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Nom",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Prénom",
          style: "tableHeader",
          // rowSpan: 3,
        },

        {
          text: "Age",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Genre",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Téléphone",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Dérnier Acte",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Prochaine Acte",
          style: "tableHeader",
          // rowSpan: 3,
        },
      ],
      // now data and values
      ...patients.map((patient, index) => {
        return [
          index + 1,
          patient.lastname,
          patient.firstname,
          patient.age,
          patient.gender,
          patient.phone,
          patient.lastacte.acte,
          patient.nextacte.acte,
        ];
      }),
    ],
  };

  listTableDocs["content"].push({
    table: table,
    style: "table",
  });

  pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  await pdfDoc.pipe(fs.createWriteStream("liste Patients.pdf"));
  // pdfDoc.createPdf(listTableDocs).open({}, win);
  pdfDoc.end();
  pdfDoc.pipe(res);
};
module.exports.generatePatientpdf = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const patient = await Patient.findById(id);
  console.log(patient.fullname);
  let pdfmake = new Pdfmake(fonts);
  let listTableDocs = {
    pageSize: "A4",
    pageOrientation: "portrait",
    // [left, top, right, bottom]
    pageMargins: [20, 80, 20, 80],
    header:{
      image: "public/assets/en-tete.png",width:580,height:100, margin: [20,10,20,80],
    },

    content: [
      {
        color: "#1e4620",
        margin: [30, 50, 0, 10],
        columns: [
          // column 1
          {
            // auto-sized columns have their widths based on their content
            width: "*",
            text: `${patient.fullname.toUpperCase()}`,
            fontSize: 26,
          },
          // column 2
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: "*",
            fontSize: 16,
            columns: [
              {
                width: "*",
                stack: [
                  "Age:",
                  "Téléphone:",
                  "Prochaine Acte:",
                  "Date:",
                  "Medecin Ref:",
                ],
                color: "#061e30",
                bold: true,
              },
              {
                width: "*",
                stack: [
                  `${patient.age} ans`,
                  `${patient.phone}`,
                  `${patient.nextacte.acte}`,
                  `${moment(patient.nextacte.date).format("DD/MM/YYYY")}`,
                  `${patient.medecinref}`,
                ],
              },
            ],
          },
        ],
      },
    ],
    // Define styles
    styles: {
      watermark: {
        color: "#2196f3",
        opacity: 0.2,
        bold: true,
        italics: false,
      },
      header: {
        fontSize: 25,
        bold: true,
        alignment: "center",
        margin: [0, 30, 0, 20],
      },
      subheader: {
        fontSize: 12,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [30, 10, 30, 10],
        color: "#4caf82",
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "#061e30",
        fillOpacity: 0.3,
        fillColor: ["stripe45d", "#2196f3"],
      },
      table: {
        fontSize: 11,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [0, 10, 0, 0],
        color: "#061e30",
      },
      text: {
        alignment: "justify",
      },
      link: {
        decoration: "underline",
        color: "#0074c1",
      },
    },
  };
  let table = {
    // headers are automatically repeated if the table spans over multiple pages
    // you can declare how many rows should be treated as headers
    headerRows: 1,
    // widths:number of columns in the table here we have 8 columns
    widths: ["*", "*", "*", "*", "*"],

    body: [
      [
        {
          text: "N°",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Acte",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Medecin",
          style: "tableHeader",
          // rowSpan: 3,
        },

        {
          text: "Technicien",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Date Acte",
          style: "tableHeader",
          // rowSpan: 3,
        },
      ],
      // now data and values
      ...patient.consultation.map((acte, index) => {
        return [
          index + 1,
          acte.acte,
          `Dr. ${acte.medecin}`,
          acte.technicien,
          moment(acte.date).format("DD/MM/YYYY"),
        ];
      }),
    ],
  };
  var qrCode = {
    // colored QR
    qr: "text in QR",
    foreground: "red",
    background: "yellow",
  };
  listTableDocs["content"].push({
    table: table,
    style: "table",
  });
  listTableDocs["content"].push({
    qr: `${patient.id}`,
    foreground: "#1e3444",
    alignment: "right",
    margin: [0, 80, 0, 10],
  });

  pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  await pdfDoc.pipe(fs.createWriteStream("patient.pdf"));
  // pdfDoc.createPdf(listTableDocs).open({}, win);
  pdfDoc.end();
  pdfDoc.pipe(res);
};
