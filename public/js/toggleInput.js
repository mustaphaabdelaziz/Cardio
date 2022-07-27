function selectActe(acte,id) {

  let technicien = document.getElementById("technicien-div-"+id);
  if (acte.value === "KT") {
    technicien.style.display = "";
  } else {
    technicien.style.display = "none";
  }
}
function selectActe2(id,acte) {
    
    let technicien2 = document.getElementById("tech-"+id);
    let select = document.getElementById(id).value;
   
  if (acte === "KT"|| select ==="KT") {
    
    technicien2.style.display = "";
  } else {
    
    technicien2.style.display = "none";
  }
}
