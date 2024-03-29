const moment = require("moment");
const Pdfmake = require("pdfmake");
const Bc = require("../../../model/materiel/bc");
const Patient = require("../../../model/patient/patient");
const Materiel = require("../../../model/materiel/materiel");

module.exports.listeKT = async (req, res) => {
  const acte = "KT";
  const patients = await Patient.find({
    "consultation.acte": { $regex: new RegExp("^" + acte + "$", "i") },
  });
  res.render("materiel/sortant/kt/index", { patients, moment });
};

// module.exports.showbc = async (req, res) => {

// // get the kt id from the kts table
// const {idbc} = req.params;
// // // find the kt in the database
// // const patient = await Patient.findById(id);
// const bcs = await Bc.find({idbc});

//  res.send(bcs);

// // // send it to the client

// //res.render("kt/bc/show", {bcs, patient });
// };

module.exports.generatepdf = async (req, res) => {
  const materiels = await Materiel.find({});
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
      margin: [0, 5, 0, 20],
    },
    content: [
      // { image: "public/assets/en-tete.png"},
      {
        text: "Liste Des Personnels",
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
        margin: [30, 10, 30, 10],
        color: "#4caf82",
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "#061e30",
        fillOpacity: 0.1,
        fillColor: ["stripe45d", "#1e4620"],
      },
      table: {
        fontSize: 11,
        alignment: "center",
        // [left, top, right, bottom]
        // margin: [40, 10, 20, 10],
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
    widths: ["*", "*", "*", "*", "*", "*", "*"],

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
          text: "Type",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Fonction",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Téléphone",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Email",
          style: "tableHeader",
          // rowSpan: 3,
        },
      ],
      // now data and values
      ...materiels.map((materiel, index) => {
        return [
          index + 1,
          materiel.lastname,
          materiel.firstname,
          materiel.externe,
          materiel.fonction,
          materiel.phone,
          materiel.email,
        ];
      }),
    ],
  };

  listTableDocs["content"].push({
    table: table,
    style: "table",
  });

  pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  await pdfDoc.pipe(fs.createWriteStream("liste Personnels.pdf"));
  // pdfDoc.createPdf(listTableDocs).open({}, win);
  pdfDoc.end();
  pdfDoc.pipe(res);
};
