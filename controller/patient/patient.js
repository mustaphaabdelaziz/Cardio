const fs = require("fs");
const Pdfmake = require("pdfmake");
// Define font files
const moment = require("moment");
const Staff = require("../../model/staff/staff");
const Country = require("../../model/data/country");
const Patient = require("../../model/patient/patient");
const Report = require("../../model/patient/compteRendu");
const conduiteMedicale = require("../../seeds/conduiteMedicale");
const actes = ["Consultation", "Chirurgie", "KT"];
var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};
const bloodGroup = ["A", "B", "O", "AB"];
const bloodRhesus = ["+", "-"];
module.exports.refactoring = async (req, res) => {
  /* select all patient that has poids, taille */
  const patients = await Patient.find({
    activated: true,
  });
  let ps = patients.reduce((total, patient) => {
    if (patient.consultation && patient.consultation.length >= 1) {
      if (
        moment(patient.consultation[0].date, "DD/MM/YYYY").isBetween(
          moment("14/10/2022", "DD/MM/YYYY"),
          moment("15/10/2022", "DD/MM/YYYY"),
          "day",
          "[]"
        )
      ) {
        return total + 1;
      }
    } else return 0;
  }, 0);

  res.send({
    Number: ps,
  });
};
module.exports.listepatient = async (req, res) => {
  const [medecins, patients, algeria] = await Promise.all([
    Staff.find({ fonction: "Medecin" }),
    // Staff.find({ fonction: "technicien cathlab" }),
    Patient.find({
      "isParent.relation": { $ne: "Foetus" },
      activated: true,
    }).sort({
      lastname: 1,
    }),
    Country.find({}),
  ]);
  const inscrit = patients.length;
  const nbrCompterendu = patients.reduce((total, patient) => {
    if (patient.consultation)
      return (
        total +
        patient.consultation.reduce((total, consultation) => {
          if (!consultation.compterendu.isEmpty) return total + 1;
          else return 0;
        }, 0)
      );
    else return 0;
  }, 0);
  // console.timeEnd('blocking-await');
  // blocking-await: 101.135ms
  // blocking-await: 141.458ms
  const states = algeria[0].states;
  // res.send(patients)
  res.render("patient/index", {
    patients,
    moment,
    medecins,
    inscrit,
    nbrCompterendu,
    states,
    bloodGroup,
    bloodRhesus,
  });
};

module.exports.creationform = async (req, res) => {
  const medecins = await Staff.find({ fonction: "Medecin" });
  const algeria = await Country.find({});
  const states = algeria[0].states;

  res.render("patient/new", {
    medecins,
    states,
    moment,
    bloodGroup,
    bloodRhesus,
  });
};
module.exports.showpatient = async (req, res) => {
  // get the patient id from the patients table
  const { id } = req.params;
  const [medecins, techniciens, patient, algeria, reports] = await Promise.all([
    Staff.find({ fonction: "Medecin" }),
    Staff.find({ fonction: "technicien cathlab" }),
    Patient.findById(id).populate("sons"),
    Country.find({}),
    Report.find({}),
  ]);
  const states = algeria[0].states;
  let medicalInfo = { saturation: "", ta: "", poids: "", taille: "" };
  // take the last value of the consultation
  if (patient.consultation.length >= 1) {
    medicalInfo.saturation = patient.sortedConsultation[
      patient.consultation.length - 1
    ].saturation
      ? patient.sortedConsultation[patient.consultation.length - 1].saturation +
        " %"
      : "/";
    medicalInfo.ta = patient.sortedConsultation[patient.consultation.length - 1]
      .ta
      ? patient.sortedConsultation[patient.consultation.length - 1].ta
      : "/";
    medicalInfo.taille = patient.sortedConsultation[
      patient.consultation.length - 1
    ].taille
      ? patient.sortedConsultation[patient.consultation.length - 1].taille +
        " cm"
      : "/";
    medicalInfo.poids = patient.sortedConsultation[
      patient.consultation.length - 1
    ].poids
      ? patient.sortedConsultation[patient.consultation.length - 1].poids +
        " kg"
      : "/";
  } else {
    medicalInfo.saturation = "/";
    medicalInfo.ta.systolicBP = "/";
    medicalInfo.ta.diastolicBP = "/";
    medicalInfo.taille = "/";
    medicalInfo.poids = "/";
  }
  // send it to the client
  res.render("patient/show", {
    patient,
    moment,
    medecins,
    techniciens,
    states,
    reports,
    conduitemedicales: conduiteMedicale.conduitemedicale,
    bloodGroup,
    bloodRhesus,
    medicalInfo,
    actes,
  });
  // res.send(patient);
};

module.exports.createpatient = async (req, res) => {
  var {
    firstname,
    lastname,
    father,
    birthdate,
    gender,
    medecinref,
    phone,
    phone2,
    status,
    wilaya,
    city,
    relation,
  } = req.body.patient;
  let isParent = {
    relation: "Fils",
    activate: false,
  };

  if (relation != "Fils") {
    isParent.activate = true;
    isParent.relation = relation;
  }
  const { blood } = req.body;
  if (phone2 === "") {
    phone2 = "/";
  }
  if (father === "") {
    father = "/";
  }

  const patient = new Patient({
    firstname:
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
    lastname:
      lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
    father: father.charAt(0).toUpperCase() + father.slice(1).toLowerCase(),
    birthdate,
    blood,
    phone,
    phone2,
    medecinref,
    gender,
    status,
    wilaya,
    city,
    isParent: isParent,
    createdBy: {
      user: req.user._id,
    },
  });
  await patient.save();
  req.flash("success", "Patient ajouté avec succès");
  res.redirect("/patient/" + patient.id);
};
module.exports.createandreturn = async (req, res) => {
  var {
    firstname,
    lastname,
    father,
    birthdate,
    gender,
    medecinref,
    phone,
    phone2,
    wilaya,
    city,
  } = req.body.patient;
  const { blood } = req.body;
  if (phone2 === "") {
    phone2 = "/";
  }
  if (father === "") {
    father = "/";
  }

  const patient = new Patient({
    firstname:
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
    lastname:
      lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
    father: father.charAt(0).toUpperCase() + father.slice(1).toLowerCase(),
    birthdate,
    blood,
    phone,
    phone2,
    medecinref,
    gender,
    wilaya,
    city,
    createdBy: {
      user: req.user._id,
    },
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
  var {
    firstname,
    lastname,
    father,
    birthdate,
    gender,
    medecinref,
    phone,
    phone2,
    wilaya,
    city,
    status,
    relation,
  } = req.body.patient;
  const { blood } = req.body;

  let isParent = {
    relation: "Fils",
    activate: false,
  };
  if (relation != "Fils") {
    isParent.activate = true;
    isParent.relation = relation;
  }

  if (phone2 === "") {
    phone2 = "/";
  }
  if (father === "") {
    father = "/";
  }

  await Patient.findByIdAndUpdate(
    id,
    {
      firstname:
        firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
      lastname:
        lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
      father: father.charAt(0).toUpperCase() + father.slice(1).toLowerCase(),
      birthdate,
      blood,
      phone,
      phone2,
      medecinref,
      gender,
      wilaya,
      city,
      isParent,

      status: !status ? "" : "Décédé",
      $push: {
        updatedBy: {
          user: req.user._id,
        },
      },
    },
    { new: true }
  );
  req.flash("success", "Patient a été modifié avec succès");
  res.redirect("back");
};
module.exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  // this make the patient inactive
  await Patient.findByIdAndUpdate(id, { $set: { activated: false } });

  // await Patient.findByIdAndDelete(id);
  req.flash("success", "Patient a été supprimé");
  res.redirect("/patient");
};

module.exports.generatepdf = async (req, res) => {
  const patients = await Patient.find({});
  let pdfmake = new Pdfmake(fonts);
  let listTableDocs = {
    pageSize: "A4",
    pageOrientation: "portrait",
    // [left, top, right, bottom]
    pageMargins: [20, 120, 20, 70],
    header: {
      image: "public/assets/en-tete.png",
      width: 590,
      height: 80,
      margin: [0, 0, 0, 0],
    },
    footer: function (currentPage, pageCount) {
      return {
        margin: 10,
        columns: [
          {
            fontSize: 12,
            text: [
              {
                text:
                  "----------------------------------------------------------------------------------------------------" +
                  "\n",
                margin: [0, 20],
              },
              {
                text: currentPage.toString() + " of " + pageCount,
              },
            ],
            alignment: "center",
          },
        ],
      };
    },
    content: [
      // { image: "public/assets/en-tete.png"},
      {
        text: "Liste Des Patients",
        style: "header",
      },
      {
        columns: [
          { width: "*", text: "" },
          {
            width: "auto",
            table: {
              style: "table",
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
                  },
                  {
                    text: "Nom",
                    style: "tableHeader",
                  },
                  {
                    text: "Prénom",
                    style: "tableHeader",
                  },

                  {
                    text: "Père",
                    style: "tableHeader",
                  },

                  {
                    text: "Age",
                    style: "tableHeader",
                  },
                  {
                    text: "Tél 1",
                    style: "tableHeader",
                  },
                  {
                    text: "Tél 2",
                    style: "tableHeader",
                  },

                  {
                    text: "Dérnier Acte",
                    style: "tableHeader",
                  },
                  {
                    text: "Prochaine Acte",
                    style: "tableHeader",
                  },
                ],

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
              alignment: "center",
            },
          },
          { width: "*", text: "" },
        ],
      },
    ],
    // Define styles
    styles: {
      header: {
        fontSize: 25,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 20],
        color: "#061e30",
      },
      subheader: {
        fontSize: 12,
        alignment: "center",
        // [left, top, right, bottom]
        margin: [30, 5, 30, 10],
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

  pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  await pdfDoc.pipe(fs.createWriteStream("liste Patients.pdf"));
  // pdfDoc.createPdf(listTableDocs).open({}, win);
  pdfDoc.end();
  pdfDoc.pipe(res);
};
module.exports.generatePatientpdf = async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);
  var date;
  if (patient.nextacte.date === "Rien") {
    date = "/";
  } else {
    date = moment(patient.nextacte.date).format("DD/MM/YYYY");
  }

  let pdfmake = new Pdfmake(fonts);

  let listTableDocs = {
    pageSize: "A4",
    pageOrientation: "portrait",
    // [left, top, right, bottom]
    pageMargins: [20, 0, 20, 0],
    header: {
      image: "public/assets/ENTETE.png",
      width: 610,
      height: 120,
      margin: [0, 60, 0, 80],
      alignment: "center",
    },

    content: [
      {
        stack: [
          {
            fontSize: 25,
            alignment: "center",
            // [left, top, right, bottom]
            margin: [20, 190, 20, 20],
            bold: true,
            text: "Dossier Patient",
            decoration: "underline",
          },
          {
            columns: [
              {
                width: "*",
                alignment: "center",
                margin: [],
                stack: [
                  {
                    text: [
                      {
                        text: `Nom:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: ` ${patient.lastname}`,
                      },
                    ],
                    margin: [20, 0, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: `Prénom:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: ` ${patient.firstname}`,
                      },
                    ],
                    margin: [20, 10, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: `Père:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: ` ${patient.father}`,
                      },
                    ],
                    margin: [20, 10, 0, 0],
                  },
                ],
              },
              {
                width: "*",
                stack: [
                  {
                    text: [
                      {
                        text: `Age:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: `${moment(patient.birthdate).format(
                          "DD/MM/YYYY"
                        )}`,
                      },
                    ],
                    margin: [20, 0, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: `Groupage:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: `${patient.groupage}`,
                      },
                    ],
                    margin: [20, 10, 0, 0],
                  },
                ],
              },
              {
                width: "*",
                stack: [
                  {
                    text: [
                      {
                        text: `Tel:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: `${patient.phone}`,
                      },
                    ],
                    margin: [20, 10, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: `Addresse:   `,
                        alignment: "left",
                        color: "#061e30",
                        bold: true,
                        // [left, top, right, bottom]
                      },
                      {
                        text: `${patient.address}`,
                      },
                    ],
                    margin: [20, 10, 0, 0],
                  },
                ],
              },
            ],
          },

          //   {
          //     width: "*",
          //     stack: [
          //       {
          //         text: "Dossier N°: ................",
          //         alignment: "right",
          //         bold: true,
          //         // [left, top, right, bottom]
          //         margin: [0, 10, 0, 20],
          //       },
          //     ],
          //     color: "#061e30",
          //     fontSize: 14,
          //   },
        ],
      },

      {
        // columns: [
        //     // { width: "*", text: "" },
        //     {
        //         width: "*",
        //         table: {
        //             // headers are automatically repeated if the table spans over multiple pages
        //             // you can declare how many rows should be treated as headers
        //             headerRows: 1,
        //             // widths:number of columns in the table here we have 8 columns
        //             widths: ["*", "*", "*", "*", "*"],
        //             body: [
        //                 [{
        //                         text: "N°",
        //                         style: "tableHeader",
        //                         // rowSpan: 3,
        //                     },
        //                     {
        //                         text: "Acte",
        //                         style: "tableHeader",
        //                         // rowSpan: 3,
        //                     },
        //                     {
        //                         text: "Medecin",
        //                         style: "tableHeader",
        //                         // rowSpan: 3,
        //                     },
        //                     {
        //                         text: "Technicien",
        //                         style: "tableHeader",
        //                         // rowSpan: 3,
        //                     },
        //                     {
        //                         text: "Date Acte",
        //                         style: "tableHeader",
        //                         // rowSpan: 3,
        //                     },
        //                 ],
        //                 // now data and values
        //                 // ...patient.consultation.map((acte, index) => {
        //                 //     return [
        //                 //         index + 1,
        //                 //         acte.acte,
        //                 //         `Dr. ${acte.medecin}`,
        //                 //         acte.technicien,
        //                 //         moment(acte.date).format("DD/MM/YYYY"),
        //                 //     ];
        //                 // }),
        //             ],
        //         },
        //     },
        //     // { width: "*", text: "" },
        // ],
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
        fillOpacity: 0.1,
        fillColor: ["stripe45d", "#1e4620"],
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
  // let table = {
  //     // headers are automatically repeated if the table spans over multiple pages
  //     // you can declare how many rows should be treated as headers
  //     headerRows: 1,
  //     // widths:number of columns in the table here we have 8 columns
  //     widths: ["*", "*", "*", "*", "*"],

  //     body: [
  //         [{
  //                 text: "N°",
  //                 style: "tableHeader",
  //                 // rowSpan: 3,
  //             },
  //             {
  //                 text: "Acte",
  //                 style: "tableHeader",
  //                 // rowSpan: 3,
  //             },
  //             {
  //                 text: "Medecin",
  //                 style: "tableHeader",
  //                 // rowSpan: 3,
  //             },

  //             {
  //                 text: "Technicien",
  //                 style: "tableHeader",
  //                 // rowSpan: 3,
  //             },
  //             {
  //                 text: "Date Acte",
  //                 style: "tableHeader",
  //                 // rowSpan: 3,
  //             },
  //         ],
  //         // now data and values
  //         // ...patient.consultation.map((acte, index) => {
  //         //     return [
  //         //         index + 1,
  //         //         acte.acte,
  //         //         `Dr. ${acte.medecin}`,
  //         //         acte.technicien,
  //         //         moment(acte.date).format("DD/MM/YYYY"),
  //         //     ];
  //         // }),
  //     ],
  // };

  // listTableDocs["content"].push({
  //   table: table,
  //   style: "table",
  // });

  pdfDoc = pdfmake.createPdfKitDocument(listTableDocs, {});
  await pdfDoc.pipe(fs.createWriteStream("patient.pdf"));
  // pdfDoc.createPdf(listTableDocs).open({}, win);
  pdfDoc.end();
  pdfDoc.pipe(res);
};



