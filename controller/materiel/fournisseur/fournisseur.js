const moment = require("moment");
const fs = require("fs");
const Pdfmake = require("pdfmake");
const Fournisseur = require("../../../model/materiel/fournisseur");
const Country = require("../../../model/data/country");
// Define font files
var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};

module.exports.listeFournisseur = async (req, res) => {
  const fournisseurs = await Fournisseur.find({});
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("fournisseur/index", { fournisseurs, moment, states });
};

module.exports.showFournisseur = async (req, res) => {
  // get the fournisseur id from the fournisseurs table
  const { id } = req.params;
  // find the fournisseur in the database
  const fournisseur = await Fournisseur.findById(id);
  // send it to the client
  res.render("fournisseur/show", { fournisseur, moment });
  // res.send(fournisseur)
};

module.exports.createFournisseur = async (req, res) => {
  const { fournisseur } = req.body;
  let phone = fournisseur.phone.trim();
  let fax = fournisseur.fax.trim();
  let mail =fournisseur.email.trim();
  if (phone === "") {
    phone = "/";
  }
  if (fax === "") {
    fax = "/";
  }
  if (mail === "") {
    mail = "/";
  }

  const newFournisseur = new Fournisseur({
    name:
      fournisseur.name.charAt(0).toUpperCase() +
      fournisseur.name.slice(1).toLowerCase(),
    wilaya: fournisseur.wilaya,
    city:fournisseur.city,
    postalCode:fournisseur.postalCode,
    phone: phone,
    fax: fax,
    mobile:fournisseur.mobile,
    email: mail,
    website: fournisseur.website,
    description: fournisseur.description,
    nrc: fournisseur.nrc,
    nif: fournisseur.nif,
    narticle: fournisseur.narticle,
    nis: fournisseur.nis,
  });
  await newFournisseur.save();

  req.flash("success", "Fournisseur ajouté avec succès");
  res.redirect("/fournisseur");
};

module.exports.updateFournisseur = async (req, res) => {
  const { id } = req.params;
  const { fournisseur } = req.body;

  let phone = fournisseur.phone.trim();
  let fax = fournisseur.fax.trim();
  let mail = fournisseur.email.trim();
  if (phone === "") {
    phone = "/";
  }
  if (fax === "") {
    fax = "/";
  }
  if (mail === "") {
    mail = "/";
  }

  await Fournisseur.findByIdAndUpdate(
    id,
    {
      name:
      fournisseur.name.charAt(0).toUpperCase() +
      fournisseur.name.slice(1).toLowerCase(),
    wilaya: fournisseur.wilaya,
    city:fournisseur.city,
    postalCode:fournisseur.postalCode,
    phone: phone,
    fax: fax,
    mobile:fournisseur.mobile,
    email: mail,
    website: fournisseur.website,
    description: fournisseur.description,
    nrc: fournisseur.nrc,
    nif: fournisseur.nif,
    narticle: fournisseur.narticle,
    nis: fournisseur.nis,
    },
    { new: true }
  );

  req.flash("success", "Fournisseur a été modifié avec succès");
  res.redirect("/fournisseur");
};
module.exports.deleteFournisseur = async (req, res) => {
  const { id } = req.params;

  await Fournisseur.findByIdAndDelete(id);
  req.flash("success", "Fournisseur a été supprimé");
  res.redirect("/fournisseur");
};
module.exports.generatepdf = async (req, res) => {
  const fournisseurs = await Fournisseur.find({});
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
        text: "Liste Des Fournisseurs",
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
    // widths:number of columns in the table here we have 6 columns
    widths: ["auto", "*", "auto", "auto", "auto", "*"],

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
          text: "Wilaya",
          style: "tableHeader",
          // rowSpan: 3,
        },

        {
          text: "Téléphone 1",
          style: "tableHeader",
          // rowSpan: 3,
        },
        {
          text: "Téléphone 2",
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
      ...fournisseurs.map((fournisseur, index) => {
        return [
          index + 1,
          fournisseur.name,
          fournisseur.wilaya,
          fournisseur.phone1,
          fournisseur.phone2,
          fournisseur.email,
        ];
      }),
    ],
  };

  listTableDocs["content"].push({
    table: table,
    style: "table",
  });

  pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  await pdfDoc.pipe(fs.createWriteStream("liste fournisseurs.pdf"));
  pdfDoc.end();
  pdfDoc.pipe(res);
};
