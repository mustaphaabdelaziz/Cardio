var selected = document.getElementById("age");
var styles = {
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
};
function printMedecinList() {
  let ps = filterPatient(12, selected.value).map((patient, index) => [
    ...patient.consultation.map((cons) => {
      return [
        index + 1,
        patient.lastname,
        patient.firstname,
        patient.father,
        patient.age,
        patient.phone,
        patient.phone2,
        cons.acte,
        moment(cons.date).format("DD/MM/YYYY"),
        cons.status,
      ];
    }),
  ]);
  console.log(ps);
  let list=[]
  for (p of ps) {
    list = [...list, ...p];
    console.log(list);
  }
  console.log(list);  
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

                    ...filterPatient(12, selected.value).map(
                      (patient, index) => {
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
