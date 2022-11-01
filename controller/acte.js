const moment = require("moment");
const underscore = require("underscore");
const Patient = require("../model/patient");

module.exports.showacteliste = async (req, res) => {
  const { id } = req.params;
  const patients = await Patient.find({
    "consultation.acte": { $regex: new RegExp("^" + id + "$", "i") },
  });
  // res.send(patients)
  res.render("patient/acte/index", { patients, acte: id, moment, underscore });
};
module.exports.filter = async (req, res) => {
  const { age } = req.query;
  const { acte } = req.query;
  if (age) {
    const patients = await Patient.find({ age: age });
    res.render("patient/acte/index", {
      patients,
      acte: id,
      moment,
      underscore,
    });
  } else {
    const { start, end } = req.query;
    const patients = await Patient.find({
      "consultation.acte": { $gte: start, $lte: end },
    });
    res.render("patient/acte/index", {
      patients,
      acte: id,
      moment,
      underscore,
    });
  }
};
module.exports.generatepdf = async (req, res) => {
  const patients = await Patient.find({});
  let pdfmake = new Pdfmake(fonts);
  let listTableDocs = {
    pageSize: "A4",
    pageOrientation: "portrait",
    // [left, top, right, bottom]
    pageMargins: [20, 55, 20, 80],
    header: {
      image: "public/assets/en-tete.png",
      width: 590,
      height: 80,
      margin: [0, 05, 0, 0],
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
        margin: [0, 80, 0, 20],
        color: "#061e30",
      },
      subheader: {
        fontSize: 12,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [30, 05, 30, 10],
        color: "#4caf82",
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        alignment: "center",
        color: "#061e30",
        fillOpacity: 0.1,
        fillColor: ["stripe45d", "#1e4620"],
      },
      table: {
        fontSize: 11,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [10, 10, 10, 10],
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
    widths: [
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
      "auto",
    ],

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
          text: "Father",
          style: "tableHeader",
          // rowSpan: 3,
        },

        {
          text: "Age",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Tél 1",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Tél 2",
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
          patient.father,
          patient.age,
          patient.phone,
          patient.phone2,
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
