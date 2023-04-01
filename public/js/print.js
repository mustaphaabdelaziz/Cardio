var selected = document.getElementById("age");
var styles = {
  header: {
    fontSize: 22,
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
    alignment: "center",
    color: "#061e30",
    fillOpacity: 0.1,
    fillColor: ["stripe45d", "#1e4620"],
  },
  table: {
    fontSize: 10,
    alignment: "center",
    // [left, top, right, bottom]
    // margin: [0, 10, 0, 10],
    color: "#061e30",
  },
  text: {
    alignment: "justify",
  },
  link: {
    decoration: "underline",
    color: "#0074c1",
  },
};

function printActeList(acte) {
  var start =
    document.getElementById("start").value || moment().format("DD/MM/YYYY");
  var end =
    document.getElementById("end").value || moment().format("DD/MM/YYYY");
  let list = [];
  let i = 1;
  for (const patient of patients) {
    for (let j = 0; j < patient.sortedConsultation.length; j++) {
      if (selected.value === "all") {
        if (
          moment(patient.sortedConsultation[j].date).isBetween(
            start,
            end,
            "days",
            "[]"
          ) &&
          patient.sortedConsultation[j].acte == acte
        )
          list.push([
            i++,
            patient.fullname,
            patient.father,
            moment(patient.birthdate).format("DD/MM/YYYY"),
            patient.phone,
            patient.consultation[j].medecin,
            moment(patient.consultation[j].date).format("DD/MM/YYYY"),
            patient.consultation[j].status,
          ]);
      } else {
        switch (selected.value) {
          case "above":
            if (
              parseInt(patient.age) >= parseInt(12) &&
              moment(
                patient.sortedConsultation[j].date,
                "DD/MM/YYYY"
              ).isBetween(start, end, "day", "[]") &&
              patient.sortedConsultation[j].acte == acte
            )
              list.push([
                i++,
                patient.fullname,
                patient.father,
                moment(patient.birthdate).format("DD/MM/YYYY"),
                patient.phone,
                patient.consultation[j].medecin,
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                patient.consultation[j].status,
              ]);
            break;

          case "below":
            if (
              parseInt(patient.age) <= parseInt(12) &&
              moment(
                patient.sortedConsultation[j].date,
                "DD/MM/YYYY"
              ).isBetween(start, end, "day", "[]") &&
              patient.sortedConsultation[j].acte == acte &&
              patient.sortedConsultation[j].compterendu.isEmpty
            )
              list.push([
                i++,
                patient.fullname,
                patient.father,
                moment(patient.birthdate).format("DD/MM/YYYY"),
                patient.phone,
                patient.consultation[j].medecin,
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                patient.consultation[j].status,
              ]);
            break;
        }
      }
    }
  }

  // this.getBase64ImageFromURL("../assets/ENTETE.PNG")
  this.getBase64ImageFromURL("/assets/ENTETE.PNG")
    .then((url) => {
      let docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
        // [left, top, right, bottom]
        pageMargins: [10, 100, 10, 70],

        header: {
          image: url,
          width: 595,
          height: 80,
          margin: [10, 10, 10, 0],
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
          {
            stack: [
              {
                text: `Liste ${acte}`,
                style: "header",
              },
              {
                text: `Date: ${moment(start).format("DD/MM/YYYY")} à ${moment(
                  end
                ).format("DD/MM/YYYY")}`,
                alignment: "left",
                bold: true,
                fontSize: 13,
                color: "#061e30",
                decoration: "underline",
                margin: [40, 0, 0, 30],
              },
              {
                columns: [
                  { width: "*", text: "" },
                  {
                    width: "auto",
                    table: {
                      // style: "table",
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
                            text: "Père",
                            style: "tableHeader",
                          },

                          {
                            text: "Date Naissance",
                            style: "tableHeader",
                          },
                          {
                            text: "Téléphone",
                            style: "tableHeader",
                          },

                          {
                            text: "Medecin",
                            style: "tableHeader",
                          },
                          {
                            text: "Date Acte",
                            style: "tableHeader",
                          },
                          {
                            text: "Confirmé",
                            style: "tableHeader",
                          },
                        ],
                        ...list,
                      ],
                      alignment: "center",
                    },
                  },
                  { width: "*", text: "" },
                ],
              },
            ],
          },
        ],

        // Define styles
        styles,
      };
      pdfMake.createPdf(docDefinition).open();
    })
    .catch((error) => {
      console.log(error);
    });
}

function printMedecinList(medecin) {
  var start =
    document.getElementById("start").value || moment().format("DD/MM/YYYY");
  var end =
    document.getElementById("end").value || moment().format("DD/MM/YYYY");

  var period = moment(start).isSame(end, "day")
    ? `${moment(start).format("DD/MM/YYYY")}`
    : `${moment(start, "DD/MM/YYYY").format("DD/MM/YYYY")} à ${moment(
        end
      ).format("DD/MM/YYYY")}`;

  let list = [];
  let i = 1;
  for (const patient of patients) {
    for (let j = 0; j < patient.consultation.length; j++) {
      if (selected.value === "all") {
        if (
          moment(
            moment(patient.consultation[j].date).format("DD/MM/YYYY"),
            "DD/MM/YYYY"
          ).isBetween(start, end, "day", "[]")
        )
          list.push([
            i,
            patient.fullname,
            patient.father,
            moment(patient.birthdate).format("DD/MM/YYYY"),
            patient.phone,
            patient.consultation[j].acte,
            moment(patient.consultation[j].date).format("DD/MM/YYYY"),
            patient.consultation[j].status,
          ]);
      } else {
        switch (selected.value) {
          case "above":
            if (
              parseInt(patient.age) >= parseInt(12) &&
              moment(
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                "DD/MM/YYYY"
              ).isBetween(start, end, "day", "[]")
            )
              list.push([
                i,
                patient.fullname,
                patient.father,
                moment(patient.birthdate).format("DD/MM/YYYY"),
                patient.phone,
                patient.consultation[j].acte,
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                patient.consultation[j].status,
              ]);
            break;

          case "below":
            if (
              parseInt(patient.age) <= parseInt(12) &&
              moment(
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                "DD/MM/YYYY"
              ).isBetween(start, end, "day", "[]")
            )
              list.push([
                i,
                patient.fullname,
                patient.father,
                moment(patient.birthdate).format("DD/MM/YYYY"),
                patient.phone,
                patient.consultation[j].acte,
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                patient.consultation[j].status,
              ]);
            break;
        }
      }
      i++;
    }
  }

  this.getBase64ImageFromURL("/assets/ENTETE.png")
    .then((url) => {
      let docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
        // [left, top, right, bottom]
        pageMargins: [10, 100, 10, 70],

        header: {
          image: url,
          width: 595,
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
          {
            stack: [
              {
                text: `Liste Dr.${medecin}`,
                style: "header",
              },
              {
                text: `Date: ${period}`,
                alignment: "left",
                bold: true,
                fontSize: 13,
                color: "#061e30",
                decoration: "underline",
                margin: [40, 0, 0, 30],
              },
              {
                columns: [
                  { width: "*", text: "" },
                  {
                    width: "auto",
                    table: {
                      // style: "table",
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
                            text: "Père",
                            style: "tableHeader",
                          },

                          {
                            text: "Date Naissance",
                            style: "tableHeader",
                          },
                          {
                            text: "Téléphone",
                            style: "tableHeader",
                          },

                          {
                            text: "Acte",
                            style: "tableHeader",
                          },
                          {
                            text: "Date Acte",
                            style: "tableHeader",
                          },
                          {
                            text: "Confirmé",
                            style: "tableHeader",
                          },
                        ],
                        ...list,
                      ],
                      alignment: "center",
                    },
                  },
                  { width: "*", text: "" },
                ],
              },
            ],
          },
        ],

        // Define styles
        styles,
      };
      pdfMake.createPdf(docDefinition).open();
    })
    .catch((error) => {
      console.log(error);
    });
}
function printPDF() {
  // var start =
  //   document.getElementById("start").value ||
  //   moment("01/01/1800", "DD/MM/YYYY").format("YYYY-MM-DD");

  // var end =
  //   document.getElementById("end").value ||
  //   moment("31/12/" + moment().add(2000, "year").year(), "DD/MM/YYYY");

  this.getBase64ImageFromURL("/assets/ENTETE.png")
    .then((url) => {
      let docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
        // [left, top, right, bottom]
        pageMargins: [10, 120, 10, 70],

        header: {
          image: url,
          width: 595,
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
                  widths: ["auto", "auto", "auto", "auto", "auto", "auto"],

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
                        text: "Père",
                        style: "tableHeader",
                      },

                      {
                        text: "Date",
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
                    ],

                    ...filterPatient(12, selected.value).map(
                      (patient, index) => {
                        return [
                          index + 1,
                          patient.fullname,
                          patient.father,
                          patient.age,
                          patient.phone,
                          patient.phone2,
                        ];
                      }
                    ),
                  ],
                  alignment: "center",
                },
              },
              { width: "*", text: "" },
            ],
          },
        ],

        // Define styles
        styles,
      };
      pdfMake.createPdf(docDefinition).open();
    })
    .catch((error) => {
      console.log(error);
    });
}

function filterPatient(age, base) {
  if (base === "all") {
    return patients;
  } else {
    switch (base) {
      case "above":
        return patients.filter((patient) => {
          // patient.lastacte.acte==lastActe && patient.nextacte.acte==nextActe

          return parseInt(patient.age) >= parseInt(age);
        });

      case "below":
        return patients.filter((patient) => {
          // patient.lastacte.acte==lastActe && patient.nextacte.acte==nextActe
          return parseInt(patient.age) <= parseInt(age);
        });
    }
  }
}
function printBC() {
  // this.getBase64ImageFromURL("http://localhost:8000/assets/ENTETE.png")
  this.getBase64ImageFromURL("/assets/ENTETE.png")
    .then((url) => {
      let docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
        // [left, top, right, bottom]
        pageMargins: [10, 120, 10, 70],

        header: {
          image: url,
          width: 595,
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
          {
            columns: [
              {
                alignment: "left",
                // star-sized columns fill the remaining space
                // if there's more than one star-column, available width is divided equally
                width: "*",
                fontSize: 13,
                columns: [
                  {
                    // auto-sized columns have their widths based on their content
                    width: "*",
                    text: "",
                    alignment: "right",
                    margin: [200, 0, 10, 0],
                  },
                  {
                    width: "auto",
                    stack: ["Patient:", "Date:"],
                    margin: [200, 0, 10, 0],
                    color: "#061e30",
                    bold: true,
                    alignment: "right",
                  },
                  {
                    margin: [10, 0, 0, 0],
                    alignment: "left",
                    width: "*",

                    stack: [
                      `${patient.fullname}`,
                      `${moment(bc.date).format("DD/MM/YYYY")}`,
                    ],
                  },
                ],
              },
            ],
          },
          {
            text: "Bon De Commande",
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
                  widths: ["*", "*", "*", "*"],

                  body: [
                    [
                      {
                        text: "N°",
                        style: "tableHeader",
                      },
                      {
                        text: "Désignation",
                        style: "tableHeader",
                      },

                      {
                        text: "Marque",
                        style: "tableHeader",
                      },

                      {
                        text: "Numéro série",
                        style: "tableHeader",
                      },
                    ],

                    ...bc.articles.map((article, index) => {
                      return [
                        index + 1,
                        article.designation,
                        article.marque,
                        article.serie,
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
        styles,
      };
      pdfMake.createPdf(docDefinition).open();
    })
    .catch((error) => {
      console.log(error);
    });
}
function printArticle() {
  // this.getBase64ImageFromURL("http://localhost:8000/assets/en-tete.png")
  // this.getBase64ImageFromURL("../assets/ENTETE.png")
  this.getBase64ImageFromURL("/assets/ENTETE.png")
    .then((url) => {
      let docDefinition = {
        pageSize: "A4",
        pageOrientation: "portrait",
        // [left, top, right, bottom]
        pageMargins: [10, 120, 10, 70],

        header: {
          image: url,
          width: 595,
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
          {
            columns: [
              {
                alignment: "left",
                // star-sized columns fill the remaining space
                // if there's more than one star-column, available width is divided equally
                width: "*",
                fontSize: 13,
                columns: [
                  {
                    // auto-sized columns have their widths based on their content
                    width: "*",
                    text: `Désignation: ${materiel.designation}`,
                    alignment: "left",
                    decoration: "underline",
                    margin: [50, 0, 10, 0],
                  },
                  {
                    width: "auto",
                    stack: ["REF:", "Quantité globale:", "Quantité Consommé:"],
                    margin: [100, 0, 0, 0],
                    color: "#061e30",
                    bold: true,
                    alignment: "left",
                  },
                  {
                    margin: [10, 0, 10, 0],
                    alignment: "left",
                    width: "auto",

                    stack: [
                      `${materiel.code}`,
                      `${materiel.qteglobal}`,
                      `${materiel.consumedQuantity}`,
                    ],
                  },
                ],
              },
            ],
          },
          {
            text: "Liste des Articles",
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
                  ],

                  body: [
                    [
                      {
                        text: "N°",
                        style: "tableHeader",
                      },
                      {
                        text: "Marque",
                        style: "tableHeader",
                      },

                      {
                        text: "Qte",
                        style: "tableHeader",
                      },
                      {
                        text: "Qte Consommé",
                        style: "tableHeader",
                      },

                      {
                        text: "N° Lot",
                        style: "tableHeader",
                      },
                      {
                        text: "Date d'achat",
                        style: "tableHeader",
                      },
                      {
                        text: "Fournisseur",
                        style: "tableHeader",
                      },

                      {
                        text: "Etat",
                        style: "tableHeader",
                      },
                    ],

                    ...materiel.article.map((article, index) => {
                      return [
                        { text: index + 1, style: "table" },
                        { text: article.marque, style: "table" },
                        { text: article.detail.length, style: "table" },
                        {
                          text: article.detail.reduce((quantity, detail) => {
                            if (detail.taken) return quantity + detail.quantite;
                            else return quantity;
                          }, 0),
                          style: "table",
                        },
                        { text: article.lot, style: "table" },
                        {
                          text: moment(article.dateachat).format("DD/MM/YYYY"),
                          style: "table",
                        },
                        { text: article.fournisseur, style: "table" },
                        { text: article.etat, style: "table" },
                      ];
                    }),
                  ],
                },
              },
              { width: "*", text: "" },
            ],
          },
        ],

        // Define styles
        styles,
      };
      pdfMake.createPdf(docDefinition).open();
    })
    .catch((error) => {
      console.log(error);
    });
}

function getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
}
function getText(paramater, unite, title, stylingText, stylingBloc) {
  return {
    text: [
      {
        text: `${title}     `,
        ...stylingText,
      },
      {
        text: `${paramater} ${unite}`,
      },
    ],
    // [left, top, right, bottom]
    ...stylingBloc,
  };
}

function printCompteRendu(consultationID, patientID) {
  let patient;
  let consultation;
  if (patientID != "non") {
    patient = patients.filter((patient) => patient._id == patientID);
    patient = patient[0];
  } else {
    patient = selectedPatient;
  }
  consultation = patient.consultation.filter(
    (acte) => acte._id == consultationID
  );
  consultation = consultation[0];

  // this.getBase64ImageFromURL("../assets/ENTETE.PNG")
  this.getBase64ImageFromURL("/assets/ENTETE.png")
    .then((url) => {
      let definition = {
        pageSize: "A4",
        pageOrientation: "portrait",
        // [left, top, right, bottom]
        pageMargins: [1, 10, 10, 10],

        header: {
          image: url,
          width: 570,
          height: 90,
          margin: [5, 0, 0, 0],
        },
      };
      let poids, taille, saturation, ta;
      /*  compterendu[
        atcd,quality,situs,aorte,valveAortique,oreilletteGauche,sia] 
        */
      let compterendu = {};
      let compterenduTextValue = [];
      let patientStyle = {
        alignment: "left",
        color: "#061e30",
        bold: true,
      };

      let columns = [
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
                  text: `${moment(patient.birthdate).format("DD/MM/YYYY")} (${
                    patient.age
                  })`,
                },
              ],
              margin: [20, 0, 0, 0],
            },
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
      ];
      let stack = [];
      if (consultation.poids) {
        // [parameters,unite,title,stylingText,stylingBloc]
        poids = getText(consultation.poids, "kg", "Poids:", patientStyle, {
          margin: [20, 0, 0, 0],
        });
        stack.push(poids);
      }
      if (consultation.taille) {
        // [parameters,unite,title,styling,margin]
        taille = getText(consultation.taille, "cm", "Taille:", patientStyle, {
          margin: [20, 10, 0, 0],
        });
        stack.push(taille);
      }
      if (consultation.saturation) {
        // [parameters,unite,title,styling,margin]
        saturation = getText(
          consultation.saturation,
          "%",
          "Saturation:",
          patientStyle,
          {
            margin: [20, 10, 0, 0],
          }
        );
        stack.push(saturation);
      }
      if (consultation.ta) {
        // [parameters,unite,title,styling,margin]
        ta = getText(consultation.ta, "", "TA:", patientStyle, {
          margin: [20, 10, 0, 0],
        });
        stack.push(ta);
      }

      columns.push({
        width: "*",
        stack: [...stack],
      });
      if (consultation.compterendu.atcd) {
        // [parameters,unite,title,styling,margin]
        compterendu.atcd = getText(
          consultation.compterendu.atcd,
          "",
          "- ATCD:",
          {
            alignment: "left",
            bold: true,
          },
          {
            alignment: "left",
            margin: [10, 15, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.atcd);
      }
      if (consultation.compterendu.quality) {
        // [parameters,unite,title,styling,margin]
        compterendu.quality = getText(
          consultation.compterendu.quality,
          "",
          "- Quality:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            margin: [10, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.quality);
      }
      compterenduTextValue.push({
        text: `Indication:`,
        fontSize: 16,
        bold: true,
        decoration: "underline",
        //[left, top, right, bottom]
        margin: [10, 20, 0, 0],
      });
      if (consultation.compterendu.indication.situs) {
        // [parameters,unite,title,styling,margin]
        compterendu.situe = getText(
          consultation.compterendu.indication.situs,
          "",
          "- Situs:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.situe);
      }
      if (consultation.compterendu.indication.aorte) {
        // [parameters,unite,title,styling,margin]
        compterendu.aorte = getText(
          consultation.compterendu.indication.aorte,
          "",
          "- Aorte:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.aorte);
      }
      if (consultation.compterendu.indication.oreilletteGauche) {
        // [parameters,unite,title,styling,margin]
        compterendu.oreilletteGauche = getText(
          consultation.compterendu.indication.oreilletteGauche,
          "",
          "- Oreillette Gauche:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.oreilletteGauche);
      }
      if (consultation.compterendu.indication.sia) {
        // [parameters,unite,title,styling,margin]

        compterendu.sia = getText(
          consultation.compterendu.indication.sia,
          "",
          "- SIA:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.sia);
      }
      if (consultation.compterendu.indication.valveAortique) {
        // [parameters,unite,title,styling,margin]
        compterendu.valveAortique = getText(
          consultation.compterendu.indication.valveAortique,
          "",
          "- Valve Aortique:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.valveAortique);
      }
      if (consultation.compterendu.indication.valveMitrale) {
        // [parameters,unite,title,styling,margin]
        compterendu.valveMitrale = getText(
          consultation.compterendu.indication.valveMitrale,
          "",
          "- Valve Mitrale:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.valveMitrale);
      }
      if (consultation.compterendu.indication.ventriculeGauche.motif) {
        // [parameters,unite,title,styling,margin]
        let motif = getText(
          consultation.compterendu.indication.ventriculeGauche.motif,
          "",
          "- Ventricule Gauche:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(motif);
      }
      // this is for DTD, SIV, FE
      let ventriculeGauche = {
        text: [],
        alignment: "left",
        margin: [100, 15, 0, 5],
      };
      if (consultation.compterendu.indication.ventriculeGauche.dtd) {
        // [parameters,unite,title,styling,margin]
        let dtd = getText(
          consultation.compterendu.indication.ventriculeGauche.dtd,
          "           ",
          "DTD:",
          { bold: true },
          {}
        );
        ventriculeGauche.text.push(dtd);
      }
      if (consultation.compterendu.indication.ventriculeGauche.siv) {
        // [parameters,unite,title,styling,margin]
        let siv = getText(
          consultation.compterendu.indication.ventriculeGauche.siv,
          "           ",
          "SIV:",
          { bold: true },
          {}
        );
        ventriculeGauche.text.push(siv);
      }
      if (consultation.compterendu.indication.ventriculeGauche.fe) {
        // [parameters,unite,title,styling,margin]
        let fe = getText(
          consultation.compterendu.indication.ventriculeGauche.fe,
          "           ",
          "FE:",
          { bold: true },
          {}
        );
        ventriculeGauche.text.push(fe);
      }
      compterenduTextValue.push(ventriculeGauche);
      if (consultation.compterendu.indication.siv) {
        // [parameters,unite,title,styling,margin]
        compterendu.siv = getText(
          consultation.compterendu.indication.siv,
          "",
          "- SIV:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.siv);
      }
      if (consultation.compterendu.indication.cavitesDroites) {
        // [parameters,unite,title,styling,margin]
        compterendu.cavitesDroites = getText(
          consultation.compterendu.indication.cavitesDroites,
          "",
          "- Cavites Droites:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.cavitesDroites);
      }
      if (consultation.compterendu.indication.tricuspide) {
        // [parameters,unite,title,styling,margin]
        compterendu.tricuspide = getText(
          consultation.compterendu.indication.tricuspide,
          "",
          "- Tricuspide:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.tricuspide);
      }
      if (consultation.compterendu.indication.arterePulmonaire) {
        // [parameters,unite,title,styling,margin]
        compterendu.arterePulmonaire = getText(
          consultation.compterendu.indication.arterePulmonaire,
          "",
          "- Artere Pulmonaire:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.arterePulmonaire);
      }
      if (consultation.compterendu.indication.pericarde) {
        // [parameters,unite,title,styling,margin]
        compterendu.pericarde = getText(
          consultation.compterendu.indication.pericarde,
          "",
          "- Pericarde:",
          { alignment: "left", bold: true },
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );
        compterenduTextValue.push(compterendu.pericarde);
      }
      compterenduTextValue.push({
        text: `Conclusion:`,
        fontSize: 16,
        bold: true,
        decoration: "underline",
        //[left, top, right, bottom]
        margin: [10, 20, 0, 0],
      });

      if (consultation.compterendu.conclusion) {
        // [parameters,unite,title,styling,margin]
        compterendu.conclusion = getText(
          consultation.compterendu.conclusion,
          "",
          "-",
          {},
          {
            alignment: "left",
            //[left, top, right, bottom]
            margin: [13, 7, 0, 0],
          }
        );

        compterenduTextValue.push(compterendu.conclusion);
      }
      compterenduTextValue.push({
        text: `Conduite Medicale:`,
        fontSize: 16,
        bold: true,
        decoration: "underline",
        //[left, top, right, bottom]
        margin: [10, 20, 0, 0],
      });
      if (
        consultation.compterendu.conduiteMedicale &&
        consultation.compterendu.filter
      ) {
        if (consultation.compterendu.filter == "Surveillance médical") {
          // [parameters,unite,title,styling,margin]
          compterendu.surveillanceperiod = getText(
            consultation.compterendu.filter +
              ", " +
              consultation.compterendu.surveillanceperiod +
              " " +
              consultation.compterendu.period,
            "",
            "-",
            {},
            {
              alignment: "left",
              //[left, top, right, bottom]
              margin: [13, 7, 0, 0],
            }
          );
          compterenduTextValue.push(compterendu.surveillanceperiod);
          compterendu.conduiteMedicale = getText(
            consultation.compterendu.conduiteMedicale,
            "",
            "-",
            {},
            {
              alignment: "left",
              //[left, top, right, bottom]
              margin: [13, 7, 0, 0],
            }
          );
          compterenduTextValue.push(compterendu.conduiteMedicale);
        } else {
          compterendu.surveillanceperiod = getText(
            consultation.compterendu.filter,
            "",
            "-",
            {},
            {
              alignment: "left",
              //[left, top, right, bottom]
              margin: [13, 7, 0, 0],
            }
          );
          compterenduTextValue.push(compterendu.surveillanceperiod);
          // [parameters,unite,title,styling,margin]
          compterendu.conduiteMedicale = getText(
            consultation.compterendu.conduiteMedicale,
            "",
            "-",
            {},
            {
              alignment: "left",
              //[left, top, right, bottom]
              margin: [13, 7, 0, 0],
            }
          );
        }
        compterenduTextValue.push(compterendu.conduiteMedicale);
      }
      compterenduTextValue.push({
        text: "Confraterellement",
        alignment: "right",
        fontSize: 14,
        //[left, top, right, bottom]
        margin: [50, 20, 50, 0],
        decoration: "underline",
      });

      let docDefinition = {
        ...definition,
        content: [
          {
            stack: [
              {
                fontSize: 20,
                alignment: "center",
                // [left, top, right, bottom]
                margin: [0, 80, 0, 20],
                bold: true,
                text: "ECHOCARDIOGRAPHIE-DOPPLER TRANS-THORACIQUE",
                decoration: "underline",
              },
              {
                columns: [...columns],
              },
              {
                text: "________________________________________________________________________________________________________",
                alignment: "center",
              },
              ...compterenduTextValue,
            ],
          },
        ],

        // Define styles
        styles,
      };
      pdfMake.createPdf(docDefinition).open();
    })
    .catch((error) => {
      console.log(error);
    });
}
