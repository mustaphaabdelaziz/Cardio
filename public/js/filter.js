var table;
var tr;
var txtValue;
var result;
var nbr;


function initElements() {
  table = document.getElementById("patientTable");
  tr = table.getElementsByTagName("tr");
  txtValue;
  result = document.getElementById("result");
  nbr = 0;
}
function filter(elementID, age, ageColumn, dateColumn) {
  initElements();
  let timer;
  const waitTimer = 2000;
  // $('#'+elementID).keyup(function (event) {
  // if (event.which === 13) {

  clearTimeout(timer);
  timer = setTimeout(() => {
    nbr = 0;
    let selected = document.getElementById("age").value;
    let start =
      document.getElementById("start").value || moment().format("DD/MM/YYYY");
    let end =
      document.getElementById("end").value || moment().format("DD/MM/YYYY");

    let tddate, tdage, ageValue, dateValue;

    for (i = 0; i < tr.length; i++) {
      tdage = tr[i].getElementsByTagName("td")[ageColumn]; //[2]
      tddate = tr[i].getElementsByTagName("td")[dateColumn]; //[6]
      if (tdage && tddate) {
        ageValue = parseInt(tdage.textContent);
        dateValue = tddate.innerText;

        if (start && end && selected) {
          // [] indicates that the start and end dates are includered in the range
          if (
            moment(dateValue, "DD/MM/YYYY").isBetween(
              start,
              end,
              "days",
              "[]"
            ) &&
            selected != "all"
          ) {
            console.log("Equals");
            switch (selected) {
              case "above":
                if (ageValue > age) {
                  tr[i].style.display = "";
                  nbr++;
                } else {
                  tr[i].style.display = "none";
                }
                break;
              case "below":
                if (ageValue <= age) {
                  tr[i].style.display = "";
                  nbr++;
                } else {
                  tr[i].style.display = "none";
                }
                break;
            }
          } else if (
            moment(dateValue, "DD/MM/YYYY").isBetween(start, end, "day", "[]")
          ) {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
        } else {
          tr[i].style.display = "";
          nbr++;
        }
      }
    }
    result.textContent = "Resultat: " + nbr;
    $("#fiterResut").show()
  
  }, waitTimer);

  // }
  // });
}
function filterAge(age) {
  initElements();
  nbr = 0;
  var selected = document.getElementById("age").value || "all";
  console.log("FIFA");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      txtValue = parseInt(td.textContent);
      if (td.textContent.indexOf("mois") != -1) {
        txtValue /= 12;
      }

      // alert(td.textContent.indexOf("ans"));

      if (selected === "all") {
        tr[i].style.display = "";
        nbr++;
      } else {
        if (selected === "above") {
          if (txtValue > age) {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
        } else if (selected === "below") {
          if (txtValue <= age) {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
  result.textContent = "Resultat: " + nbr;
  $("#fiterResut").show()
}
/* the filter acte function takes two arguments:
 the id of the select option it's used to make the function 
 multi usage across multiple select options
 and the column id of the table to search in 
 */
function filterActe(idSelect, idColumn) {
  initElements();
  nbr = 0;
  var selected = document.getElementById(idSelect).value;

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[idColumn];
    if (td) {
      txtValue = td.textContent.toLowerCase().trim();

      switch (selected) {
        case "all":
          tr[i].style.display = "";
          nbr++;
          break;
        case "chirurgie":
          if (txtValue === "chirurgie") {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
          break;
        case "consultation":
          if (txtValue === "consultation") {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
          break;
        case "kt":
          if (txtValue === "kt") {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
          break;
        case "no-acte":
          if (txtValue === "/") {
            tr[i].style.display = "";
            nbr++;
          } else {
            tr[i].style.display = "none";
          }
          break;
      }
    }
  }
  result.textContent = "Resultat: " + nbr;
  $("#fiterResut").show()
}
