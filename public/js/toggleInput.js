function selectActe(acte, id) {
  let technicien = document.getElementById("technicien-div-" + id);
  if (acte.value === "KT") {
    technicien.style.display = "";
  } else {
    technicien.style.display = "none";
  }
}
function selectActe2(id, acte) {
  let technicien2 = document.getElementById("tech-" + id);
  let select = document.getElementById(id).value;

  if (acte === "KT" || select === "KT") {
    technicien2.style.display = "";
  } else {
    technicien2.style.display = "none";
  }
}

function selectFilter2(filter, id) {
  let period = document.getElementById("surveillanceperiod-" + id);
  let per = document.getElementById("period-" + id);

  if (filter === "Surveillance médical") {
    period.disabled = "";
    per.disabled = "";
  } else {
    period.disabled = "disabled";
    per.disabled = "disabled";
  }
  if (filter.value === "Autre") {
    $("#conduiteMedicale-" + id).toggle();
  } else {
    $("#conduiteMedicale-" + id).hide();
  }
}

function selectFilter(filter, id) {
  let period = document.getElementById("surveillanceperiod-" + id);
  let per = document.getElementById("period-" + id);

  if (filter.value === "Surveillance médical") {
    period.disabled = "";
    per.disabled = "";
  } else {
    period.disabled = "disabled";
    per.disabled = "disabled";
  }
  if (filter.value === "Autre") {
    $("#conduiteMedicale-" + id).toggle();
  } else {
    $("#conduiteMedicale-" + id).hide();
  }
}

function makeSubmenuAct(value, id) {
  let elementId;

  if (id.length == 0) elementId = "#acte";
  else elementId = "#acte" + id;

  let actes = examens
    .filter((examen) => examen.service === value)
    .map((examen) => examen.speciality);

  $("#acteDiv").show();
  $(elementId)
    .empty()
    .append("<option class='option' selected disabled value=''>Acte</option>");
  for (const acte of actes[0]) {
    $(elementId).append(new Option(acte, acte));
  }
  // }
}
function makeSubmenu(value, id) {
  let elementId;

  if (id.length == 0) elementId = "#city";
  else elementId = "#city" + id;

  let communes = states
    .filter((state) => state.name === value)
    .map((state) => state.communes);
  // if (value == "") {

  $(elementId)
    .empty()
    .append("<option class='option' selected disabled value=''>Ville</option>");
  // } else {
  for (const ville of communes[0]) {
    $(elementId).append(new Option(ville, ville));
  }
  // }
}
function MaterielArticles(value, id) {
  let elementId;
  if (id.length != "") elementId = "#article";
  else elementId = "#article" + id;
  let articles = materials
    .filter((material) => material.designation === value)
    .map((material) => material.article);
  $(elementId)
    .empty()
    .append(
      "<option class='option' selected disabled value=''>Article</option>"
    );
  for (const article of articles[0])
    $(elementId).append(new Option(article.marque, article.marque));
}
function ArticleDetails(value, id) {
  // get the article designation
  const designation = document.getElementById("designation").value;
  let elementId;
  /* this statement is sude to set the selected id of the element 
  to fill the details of the article when id is not empty it means 
  that we're in the edit form if it's not it means we're on the new form
  */
  if (id.length != "") elementId = "#serialN";
  else elementId = "#serialN" + id;
  /*
  go throught the materials array and 
  filter the articles that match the designation
  and map the articles that match the name of article 
  after that get the details attribute only
   */
  let articles = materials
    .filter((material) => material.designation === designation)
    .map((material) => material.article)[0]
    .filter((article) => article.marque === value && article.etat === "Reçu")
    .map((article) => article.detail);
  /* 
    empty the list and append the serial numbers list
    */
  $(elementId)
    .empty()
    .append(
      "<option class='option' selected disabled value=''>Numéro série</option>"
    );
  for (const detail of articles[0])
    if (!detail.taken)
      $(elementId).append(new Option(detail.serie, detail.serie));
}
function generateField(line) {
  const type = $("#model-" + line).val();
  for (const report of reports) {
    if (report.type == type) {
      $("#atcd-" + line).val(report.atcd);
      $("#quality-" + line).val(report.quality);
      $("#situs-" + line).val(report.indication.situs);
      $("#aorte-" + line).val(report.indication.aorte);
      $("#oreilletteGauche-" + line).val(report.indication.oreilletteGauche);
      $("#sia-" + line).val(report.indication.sia);
      $("#siv-" + line).val(report.indication.siv);
      $("#valveAortique-" + line).val(report.indication.valveAortique);
      $("#valveMitrale-" + line).val(report.indication.valveMitrale);
      $("#motif-" + line).val(report.indication.ventriculeGauche.motif);
      $("#ventGsiv-" + line).val(report.indication.ventriculeGauche.siv);
      $("#dtd-" + line).val(report.indication.ventriculeGauche.dtd);
      $("#fe-" + line).val(report.indication.ventriculeGauche.fe);
      $("#cavitesDroites-" + line).val(report.indication.cavitesDroites);
      $("#tricuspide-" + line).val(report.indication.tricuspide);
      $("#arterePulmonaire-" + line).val(report.indication.arterePulmonaire);
      $("#pericarde-" + line).val(report.indication.pericarde);
      $("#conclusion-" + line).val(report.conclusion);
      $("#conduiteMedicale-" + line).val(report.conduiteMedicale);
    }
  }
}
$(document).ready(function () {
  // if ($("#patientRole : selected").val() != "Père") $("#bebe-info").hide();
  // else $("#bebe-info").show();

  if ($("#relation").text() == "Père") {
    $("#bebe-info").show();
  } else {
    $("#bebe-info").hide();
  }

  $("#show_hide_login").on("click", function () {
    var passInput = $("#loginPassword");
    if (passInput.attr("type") === "password") {
      passInput.attr("type", "text");
      $("#icon-eye").toggleClass("bi-eye-slash-fill");
    } else {
      passInput.attr("type", "password");
      $("#icon-eye").toggleClass("bi-eye-slash-fill");
    }
  });
  $("#show_hide_register").on("click", function () {
    var passInput = $("#registerPassword");
    if (passInput.attr("type") === "password") {
      passInput.attr("type", "text");
      $("#icon-eye-register").toggleClass("bi-eye-slash-fill");
    } else {
      passInput.attr("type", "password");
      $("#icon-eye-register").toggleClass("bi-eye-slash-fill");
    }
  });
  $("#show_hide_confirmed").on("click", function () {
    var passInput = $("#confirmedPassword");
    if (passInput.attr("type") === "password") {
      passInput.attr("type", "text");
      $("#icon-eye-confirmed").toggleClass("bi-eye-slash-fill");
    } else {
      passInput.attr("type", "password");
      $("#icon-eye-confirmed").toggleClass("bi-eye-slash-fill");
    }
  });
});
function toggleBebeInfo(value) {
  $("#bebe-info").toggle();
}
function activateInput(id) {
  $("#" + id).toggle();
}
let phoneIndex = 2;
  $(document).ready(function () {

    // Function to add a new phone input
    function addPhoneInput(value = '',container) {
      const newPhoneInput = `
            <div class="input-group form-floating col-sm-12 col-md-4 mb-3" id="mobile-${phoneIndex}">
                <input type="text" class="form-control" name="fournisseur[mobile][]" value="${value}" required>
                <button type="button" class="btn btn-outline-lightCoral bg-gradient removePhoneButton"><i class="bi bi-trash"></i></button>
                <label for="mobile-${phoneIndex}" class="form-label">Mobile ${phoneIndex}</label>
                <div class="valid-feedback">BIEN</div>
                
            </div>`;
      $(container).append(newPhoneInput);
      phoneIndex++;
    }

    // Add initial phone inputs 
    const initialPhones = mobiles;
    initialPhones.forEach(phone => addPhoneInput(phone,'#phoneContaineredit'));

    // Add new phone input on button click
    $('#addPhoneButton').click(function () {
      addPhoneInput('','#phoneContainer');
     
    });
    $('#addPhoneButtonedit').click(function () {
      addPhoneInput('','#phoneContaineredit');
    });

    // Remove phone input on button click
    $('#phoneContainer').on('click', '.removePhoneButton', function () {
      $(this).parent().remove();
    });
    $('#phoneContaineredit').on('click', '.removePhoneButton', function () {
      $(this).parent().remove();
    });
  });