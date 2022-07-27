const moment = require("moment");
const fs = require("fs");
const Pdfmake = require("pdfmake");
const Materiel = require("../model/materiel");
// Define font files
var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};

module.exports.listeMateriel = async (req, res) => {
  const materiels = await Materiel.find({});
  res.render("materiel/index", { materiels });
};
module.exports.creationform = (req, res) => {
  res.render("materiel/index");
};
module.exports.showMateriel = async (req, res) => {
  // get the materiel id from the materiels table
  const { id } = req.params;
  // find the materiel in the database
  const materiel = await Materiel.findById(id);
  // send it to the client
  res.render("materiel/article/show", { materiel, moment });
  // res.send(materiel)
};

module.exports.createMateriel = async (req, res) => {
  const { code, designation } =
    req.body.materiel;
  let code1 = code.trim();
  if (code1 === "") {
    code1 = "/";
  }
    const materiel = new Materiel({
    code: code1,
    designation: designation.charAt(0).toUpperCase() + designation.slice(1).toLowerCase(),
    
  });
  await materiel.save();
  req.flash("success", "Materiel a été ajouté avec succès");
  res.redirect("/materiels");
};
module.exports.showEditForm = async (req, res) => {
  res.render("materiels/edit");
};
module.exports.updateMateriel = async (req, res) => {
  const { id } = req.params;
  const { code, designation } =
    req.body.materiel;
 
  
    await Materiel.findByIdAndUpdate(id,
      { code: code, designation: designation },
      { new: true });
  

  req.flash("success", "Materiel a été modifié avec succès");
  res.redirect(`back`);
};
module.exports.deleteMateriel = async (req, res) => {
  const { id } = req.params;
 
  await Materiel.findByIdAndDelete(id);
  req.flash("success", "Materiel a été supprimé");
  res.redirect("/materiels");
};
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
      margin: [0, 05, 0, 20],
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
