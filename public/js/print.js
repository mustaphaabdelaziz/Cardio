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
    margin: [30, 05, 30, 10],
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
  var start = document.getElementById("start").value || moment();
  var end = document.getElementById("end").value || moment();
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
                patient.consultation[j].medecin,
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
                patient.consultation[j].medecin,
                moment(patient.consultation[j].date).format("DD/MM/YYYY"),
                patient.consultation[j].status,
              ]);
            break;
        }
      }
      i++;
    }
  }

  this.getBase64ImageFromURL("../assets/en-tete.png")
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
                text: `Liste .${acte}`,
                style: "header",
              },
              {
                text: `Date: ${moment().format("DD/MM/YYYY")}`,
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

  this.getBase64ImageFromURL("../assets/en-tete.png")
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

  this.getBase64ImageFromURL("../assets/en-tete.png")
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
  this.getBase64ImageFromURL("http://localhost:8000/assets/en-tete.png")
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
  this.getBase64ImageFromURL("http://localhost:8000/assets/en-tete.png")
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
                    decoration:"underline",
                    margin: [50, 0, 10, 0],
                  },
                  {
                    width: "auto",
                    stack: ["REF:", "Quantité globale:", "Quantité Consommé:"],
                    margin: [100, 0, 0, 0],
                    color: "#061e30",
                    bold: true,
                    alignment: "right",
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
