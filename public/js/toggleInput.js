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
function makeSubmenu(value, id) {
  let elementId;
  if (id.length != "") elementId = "#city";
  else elementId = "#city" + id;
  let communes = states
    .filter((state) => state.name === value)
    .map((state) => state.communes);

  if (value.length == 0) {
    $(elementId)
      .empty()
      .append(
        "<option class='option' selected disabled value=''>Ville</option>"
      );
  } else {
    for (const ville of communes[0]) {
      console.log(ville);
      $(elementId).append(new Option(ville, ville));
    }
  }
}
