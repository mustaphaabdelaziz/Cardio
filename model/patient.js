const mongoose = require("mongoose");
const moment = require("moment");
const underscore = require("underscore");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;

const Patient = new Schema(
  {
    firstname: { type: String, trim: true, required: true },
    lastname: { type: String, trim: true, required: true },
    father: {
      type: String,
      trim: true,
      default: "/",
    },
    birthdate: { type: Date, default: Date.now },
    poids: {
      type: Number,
      default: "/",
    },
    taille: {
      type: Number,
      default: "/",
    },
    saturation: {
      type: String,
      default: "/",
      trim: true,
    },
    ta: {
      type: String,
      default: "/",
      trim: true,
    },
    blood: {
      groupe: {
        type: String,
        default: "",
        trim: true,
      },
      rhesus: {
        type: String,
        default: "",
        trim: true,
      },
    },

    phone: {
      type: String,
      trim: true,
    },
    phone2: {
      type: String,
      trim: true,
      default: "/",
    },
    gender: String,
    wilaya: {
      type: String,
      default: "/",
    },
    city: {
      type: String,
      default: "/",
    },
    medecinref: {
      type: String,
      default: "/",
    },

    consultation: [
      {
        medecin: String,
        technicien: {
          type: String,
          default: "/",
        },
        date: Date,
        time: String,
        acte: String,
        poids: {
          type: Number,
        },
        taille: {
          type: Number,
        },
        saturation: {
          type: String,
        },
        ta: {
          type: String,
        },

        comment: {
          type: String,
          trim: true,
          default: "Pas de commentaire",
        },
        compterendu: {
          isEmpty: Boolean,
          atcd: {
            type: String,
            trim: true,
          },
          quality: {
            type: String,
            trim: true,
          },
          indication: {
            _id: false,
            situs: {
              type: String,
              trim: true,
            },
            aorte: {
              type: String,
              trim: true,
            },
            valveAortique: {
              type: String,
              trim: true,
            },
            oreilletteGauche: {
              type: String,
              trim: true,
            },
            sia: {
              type: String,
              trim: true,
            },
            valveMitrale: {
              type: String,
              trim: true,
            },
            ventriculeGauche: {
              motif: {
                type: String,
                trim: true,
              },
              dtd: {
                type: String,
                trim: true,
              },
              siv: {
                type: String,
                trim: true,
              },
              fe: {
                type: String,
                trim: true,
              },
            },
            siv: {
              type: String,
              trim: true,
            },
            cavitesDroites: {
              type: String,
              trim: true,
            },
            tricuspide: {
              type: String,
              trim: true,
            },
            arterePulmonaire: {
              type: String,
              trim: true,
            },
            pericarde: {
              type: String,
              trim: true,
            },
          },
          filter: {
            type: String,
            trim: true,
          },
          surveillanceperiod: Number,
          period: {
            type: String,
            trim: true,
          },
          conclusion: {
            type: String,
            trim: true,
          },
          conduiteMedicale: {
            type: String,
            trim: true,
          },
          createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        },
        status: {
          type: String,
          default: "non",
        },
        createdBy: {
          _id: false,
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      },
    ],
    activated: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      _id: false,
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
    updatedBy: [
      {
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  opts
);
Patient.virtual("fullname").get(function () {
  return this.lastname + " " + this.firstname;
});
Patient.virtual("address").get(function () {
  return this.city + ", " + this.wilaya;
});
Patient.virtual("saturationP").get(function () {
  return this.saturation + " %";
});
Patient.virtual("drlastname").get(function () {
  if (this.medecinref === "/") {
    return this.medecinref;
  } else {
    return "Dr. " + this.medecinref;
  }
});
Patient.virtual("age").get(function () {
  /*
  age:{
    value:Number
    format:mois/année
  }
  */
  if (this.birthdate) {
    var now = moment();
    var bday = moment(this.birthdate);
    var age = Math.round(now.diff(bday, "months", true));
    if (age >= 12) {
      return Math.round(now.diff(bday, "years", true)) + " ans";
    } else return age + " mois";
  } else {
    return "/";
  }
});
Patient.virtual("groupage").get(function () {
  return this.blood.groupe + this.blood.rhesus;
});

Patient.virtual("sortedConsultation").get(function () {
  return underscore.sortBy(this.consultation, "date");
});

Patient.virtual("lastacte").get(function () {
  //lastacte= prochaine acte
  if (this.consultation.length > 0) {
    // Sorted list of actes by date from old to new date
    const actes = underscore.sortBy(this.consultation, "date");

    // const test =moment("03/03/2021","DD/MM/YYYY").isBefore(moment(),"day") && moment("03/03/2021","DD/MM/YYYY").isAfter(moment("02/10/2020","DD/MM/YYYY"),"day")
    var lastacte = {
      acte: "/",
      date: moment("01/01/1900", "DD/MM/YYYY"),
    };
    var changed = false;
    for (const acte of actes) {
      const test =
        moment(acte.date).isBefore(moment()) &&
        moment(acte.date).isAfter(lastacte.date);

      if (
        moment(acte.date).isBefore(moment(), "day") &&
        moment(acte.date).isAfter(lastacte.date)
      ) {
        lastacte = {
          acte: acte.acte,
          date: moment(acte.date),
        };
        changed = true;
      }
    }
    // dans le cas lorsque la 1er valeur du tableau c'est le prochaine acte
    if (!changed) {
      return {
        acte: "/",
      };
    }

    return lastacte;
  } else {
    // dans le cas est le tableau est vide
    return {
      acte: "/",
    };
  }
});
Patient.virtual("nextacte").get(function () {
  //lastacte= prochaine acte
  if (this.consultation.length > 0) {
    // Sorted list of actes by date from old to new date
    const actes = underscore.sortBy(this.consultation, "date");

    var now = moment();
    var lastacte = {
      acte: "/",
      date: now.add(5000, "year"),
    };

    for (const acte of actes) {
      if (
        (moment(acte.date).isAfter(moment(), "day") ||
          moment(acte.date).isSame(moment(), "day")) &&
        moment(acte.date).isBefore(lastacte.date, "day")
      ) {
        lastacte = {
          acte: acte.acte,
          date: moment(acte.date),
        };
      }
    }
    if (lastacte.acte === "/") {
      return {
        acte: "/",
        date: "Rien",
      };
    }
    return lastacte;
  } else {
    return {
      acte: "/",
      date: "Rien",
    };
  }
});

module.exports = mongoose.model("Patient", Patient);
