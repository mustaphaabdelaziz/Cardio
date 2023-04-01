const moment = require("moment");
const fs = require("fs");
const Pdfmake = require("pdfmake");
const Staff = require("../../model/staff/staff");
const fonctions = require("../../seeds/fonction");
// Define font files
var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};

module.exports.listeStaff = async (req, res) => {
  const staffs = await Staff.find({});
  res.render("staff/index", { staffs, moment,fonctions: fonctions.fonction});
};
module.exports.creationform = (req, res) => {
  res.render("staff/index");
};
module.exports.showStaff = async (req, res) => {
  // get the staff id from the staffs table
  const { id } = req.params;
  // find the staff in the database
  const staff = await Staff.findById(id);
  // send it to the client
  res.render("staff/show", { staff, moment });
  // res.send(staff)
};

module.exports.createStaff = async (req, res) => {
  const { firstname, lastname, fonction, externe, phone, email } =
    req.body.staff;
  let phone1 = phone.trim();
  let email1 = email.trim();
  if (phone1 === "") {
    phone1 = "/";
  }
  if (email1 === "") {
    email1 = "/";
  }

  const staff = new Staff({
    firstname:
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
    lastname:
      lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
    fonction,
    phone: phone1,
    email: email1,
    externe,
  });
  await staff.save();
  req.flash("success", "Staff ajouté avec succès");
  res.redirect("/staffs");
};
module.exports.showEditForm = async (req, res) => {
  res.render("staffs/edit");
};
module.exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, fonction, phone, email, externe } =
    req.body.staff;
  const type = externe;
  let phone1 = phone.trim();
  let email1 = email.trim();
  if (phone1 === "") {
    phone1 = "/";
  }
  if (email1 === "") {
    email1 = "/";
  }
  if (type === "externe") {
    await Staff.findByIdAndUpdate(
      id,
      {
        firstname:
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
        lastname:
          lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
        fonction,
        phone: phone1,
        email: email1,
        externe,
      },
      { new: true }
    );
  } else {
    await Staff.findByIdAndUpdate(
      id,
      {
        firstname:
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
        lastname:
          lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
        fonction,
        phone: phone1,
        email: email1,
        externe: "interne",
      },
      { new: true }
    );
  }

  req.flash("success", "Staff a été modifié avec succès");
  res.redirect("/staffs");
};
module.exports.deleteStaff = async (req, res) => {
  const { id } = req.params;

  await Staff.findByIdAndDelete(id);
  req.flash("success", "Staff a été supprimé");
  res.redirect("/staffs");
};
module.exports.generatepdf = async (req, res) => {
  const staffs = await Staff.find({});
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
      ...staffs.map((staff, index) => {
        return [
          index + 1,
          staff.lastname,
          staff.firstname,
          staff.externe,
          staff.fonction,
          staff.phone,
          staff.email,
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
