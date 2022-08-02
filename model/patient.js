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
    firstname: String,
    lastname: String,
    father: {
      type: String,
      default: "/",
    },
    birthdate: Date,
    phone: String,
    phone2: {
      type: String,
      default: "/",
    },
    gender: String,
    wilaya: {
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
        acte: String,
        comment: {
          type: String,
          default: "Pas de commentaire",
        },
        status: {
          type: String,
          default: "non",
        },
      },
    ],
  },
  opts
);
Patient.virtual("fullname").get(function () {
  return this.lastname + " " + this.firstname;
});
Patient.virtual("drlastname").get(function () {
  if (this.medecinref === "/") {
    return this.medecinref;
  } else {
    return "Dr. " + this.medecinref;
  }
});
Patient.virtual("age").get(function () {
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
