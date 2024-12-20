const moment = require("moment");
const Materiel = require("../../../model/materiel/materiel");

module.exports.showdetail = async (req, res) => {
  // get the materiel id from the materiels table
  const { id, idarticle } = req.params;
  const materiel = await Materiel.findOne(
    { _id: id, "article._id": idarticle },
    { "article.$": 1, designation: 1, code: 1 }
  );
  // send it to the client
  // res.send(materiel.article);

  res.render("materiel/entrant/article/detail/show", {
    materiel,
    articles: materiel.article,
    moment,
  });
};

module.exports.addDetail = async (req, res) => {
  let { serie, ddp } = req.body.detail;
  const { id, idarticle } = req.params;

  const materiel = await Materiel.findOneAndUpdate(
    { _id: id, "article._id": idarticle },
    {
      $push: {
        "article.$.detail": {
          serie,
          ddp,
        },
      },
    },
    { new: true }
  );

 const redirectUrl = req.get("Referrer") || "/";
  req.flash("success", "Les détails ont été ajouté avec succès");
  res.redirect(redirectUrl);

};
module.exports.deletedetail = async (req, res) => {
  const { id, idarticle, iddetail } = req.params;
  await Materiel.findOneAndUpdate(
    {
      _id: id,
      "article._id": idarticle,
    },
    {
      $pull: {
        "article.$[].detail": {
          _id: iddetail,
        },
      },
    }
  );
  req.flash("success", "detail à été supprimé avec succès");
  res.redirect(`/materiel/${id}/articles/${idarticle}`);
};
module.exports.updatedetail = async (req, res) => {
  const { id, idarticle, iddetail } = req.params;

  const { serie, ddp } = req.body.detail;

  await Materiel.findOneAndUpdate(
    {
      _id: id,
      article: {
        $elemMatch: {
          _id: idarticle,
          "detail._id": iddetail,
        },
      },
    },
    {
      $set: {
        "article.$[].detail.$[inner].serie": serie,
        "article.$[].detail.$[inner].ddp": ddp,
      },
    },
    { arrayFilters: [{ "inner._id": iddetail }] }
  ).then((result, err) => {
    if (err) {
      console.error("Error updating service: " + err);
      // res.send(result);
    } else {
      req.flash("success", "Article à été modifé avec succès");
      res.redirect(`/materiel/${id}/articles/${idarticle}`);
    }
  });
};
