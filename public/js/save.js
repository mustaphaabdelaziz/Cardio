function printCompteRendu(consultationID, patientID) {
    let patient;
    let consultation;
    if (patientID != "non") {
      patient = patients.filter((patient) => patient._id == patientID);
      patient = patient[0];
      consultation = patient.consultation.filter(
        (acte) => acte._id == consultationID
      );
    } else {
      patient = selectedPatient;
      consultation = patient.consultation.filter(
        (acte) => acte._id == consultationID
      );
    }
  
    this.getBase64ImageFromURL("../assets/ENTETE.PNG")
      .then((url) => {
        let docDefinition = {
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
                              )} (${patient.age})`,
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
                    {
                      width: "*",
                      stack: [
                        {
                          text: [
                            {
                              text: ` ${
                                consultation[0].poids ? null : "Pioids:   "
                              }`,
                              alignment: "left",
                              color: "#061e30",
                              bold: true,
                              // [left, top, right, bottom]
                            },
                            {
                              text: `${consultation[0].poids} kg`,
                            },
                          ],
                          margin: [20, 0, 0, 0],
                        },
                        {
                          text: [
                            {
                              text: `Taille:   `,
                              alignment: "left",
                              color: "#061e30",
                              bold: true,
                              // [left, top, right, bottom]
                            },
                            {
                              text: `${patient.taille} cm`,
                            },
                          ],
                          margin: [20, 10, 0, 0],
                        },
                        {
                          text: [
                            {
                              text: `Saturation:   `,
                              alignment: "left",
                              color: "#061e30",
                              bold: true,
                              // [left, top, right, bottom]
                            },
                            {
                              text: `${patient.saturationP}`,
                            },
                          ],
                          margin: [20, 10, 0, 0],
                        },
                      ],
                    },
                  ],
                },
                {
                  text: "________________________________________________________________________________________________________",
                  alignment: "center",
                },
                // ============================= ATCD ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.atcd === "" ? "" : "- ATCD: "
                      }`,
                      bold: true,
                    },
                    {
                      text: `${
                        consultation[0].compterendu.atcd === ""
                          ? ""
                          : consultation[0].compterendu.atcd
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [10, 15, 0, 0],
                },
                // ============================= Quality Technique ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.quality === ""
                          ? ""
                          : "- Quality Technique:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `- ${
                        consultation[0].compterendu.quality === ""
                          ? ""
                          : consultation[0].compterendu.quality
                      }`,
                    },
                  ],
  
                  //[left, top, right, bottom]
                  margin: [10, 7, 0, 0],
                },
                // ============================= Indication ============================
                {
                  text: `Indication:`,
                  fontSize: 16,
                  bold: true,
                  decoration: "underline",
                  //[left, top, right, bottom]
                  margin: [10, 20, 0, 0],
                },
                // ============================= Situs ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.situs === ""
                          ? ""
                          : "- Situs:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.situs === ""
                          ? ""
                          : consultation[0].compterendu.indication.situs
                      }`,
                    },
                  ],
                  alignment: "left",
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Aorte ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.aorte === ""
                          ? ""
                          : "- Aorte:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.aorte === ""
                          ? ""
                          : consultation[0].compterendu.indication.aorte
                      }`,
                    },
                  ],
                  alignment: "left",
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Valve Aortique ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.valveAortique ===
                        ""
                          ? ""
                          : "- Valve Aortique:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.valveAortique ===
                        ""
                          ? ""
                          : consultation[0].compterendu.indication.valveAortique
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Oreillette Gauche ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication
                          .oreilletteGauche === ""
                          ? ""
                          : "- Oreillette Gauche:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication
                          .oreilletteGauche === ""
                          ? ""
                          : consultation[0].compterendu.indication
                              .oreilletteGauche
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Sia ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.sia === ""
                          ? ""
                          : "- SIA:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.sia === ""
                          ? ""
                          : consultation[0].compterendu.indication.sia
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Valve Mitrale ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.valveMitrale === ""
                          ? ""
                          : "- Valve Mitrale:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.valveMitrale === ""
                          ? ""
                          : consultation[0].compterendu.indication.valveMitrale
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Ventricule Gauche ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .motif === ""
                          ? ""
                          : "- Ventricule Gauche:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .motif === ""
                          ? ""
                          : consultation[0].compterendu.indication
                              .ventriculeGauche.motif
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
  
                // ============================= DTD, SIV, FE ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .dtd === ""
                          ? ""
                          : "DTD:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .dtd === ""
                          ? ""
                          : consultation[0].compterendu.indication
                              .ventriculeGauche.dtd
                      }            `,
                      // margin: [90, 5, 0, 0],
                    },
                    // =============================
                    {
                      text: `${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .siv === ""
                          ? ""
                          : "SIV:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .siv === ""
                          ? ""
                          : consultation[0].compterendu.indication
                              .ventriculeGauche.siv
                      }            `,
                      // margin: [95, 5, 0, 0],
                    },
                    // =============================
                    {
                      text: `${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .fe === ""
                          ? ""
                          : "FE:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.ventriculeGauche
                          .fe === ""
                          ? ""
                          : consultation[0].compterendu.indication
                              .ventriculeGauche.fe
                      }            `,
                      // margin: [95, 5, 0, 0],
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [100, 5, 0, 0],
                },
                // ============================= SIV ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.siv === ""
                          ? ""
                          : "- Siv:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.siv === ""
                          ? ""
                          : consultation[0].compterendu.indication.siv
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Cavites Droites ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.cavitesDroites ===
                        ""
                          ? ""
                          : "- Cavites Droites:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.cavitesDroites ===
                        ""
                          ? ""
                          : consultation[0].compterendu.indication.cavitesDroites
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Tricuspide ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.tricuspide === ""
                          ? ""
                          : "- Tricuspide:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.tricuspide === ""
                          ? ""
                          : consultation[0].compterendu.indication.tricuspide
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Artere Pulmonaire ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication
                          .arterePulmonaire === ""
                          ? ""
                          : "- Artere Pulmonaire:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication
                          .arterePulmonaire === ""
                          ? ""
                          : consultation[0].compterendu.indication
                              .arterePulmonaire
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Pericarde ============================
                {
                  text: [
                    {
                      text: `${
                        consultation[0].compterendu.indication.pericarde === ""
                          ? ""
                          : "- Pericarde:"
                      }`,
                      bold: true,
                    },
                    {
                      text: `  ${
                        consultation[0].compterendu.indication.pericarde === ""
                          ? ""
                          : consultation[0].compterendu.indication.pericarde
                      }`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Conclusion ============================
  
                {
                  text: `Conclusion:`,
                  fontSize: 16,
                  bold: true,
                  decoration: "underline",
                  //[left, top, right, bottom]
                  margin: [10, 20, 0, 0],
                },
                {
                  text: [
                    {
                      text: `${consultation[0].compterendu.conclusion}`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Conduite Medicale ============================
                {
                  text: `Conduite Medicale:`,
                  fontSize: 16,
                  bold: true,
                  decoration: "underline",
                  //[left, top, right, bottom]
                  margin: [10, 20, 0, 0],
                },
                {
                  text: [
                    {
                      text: `${consultation[0].compterendu.conduiteMedicale}`,
                    },
                  ],
                  alignment: "left",
  
                  //[left, top, right, bottom]
                  margin: [13, 7, 0, 0],
                },
                // ============================= Confraterellement =============================
                {
                  text: "Confraterellement",
                  alignment: "right",
                  fontSize: 14,
                  //[left, top, right, bottom]
                  margin: [50, 20, 50, 0],
                  decoration: "underline",
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