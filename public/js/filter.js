var table = document.getElementById("patientTable");
var tr = table.getElementsByTagName("tr");
var txtValue;

function filter(age,ageColumn,dateColumn) {
  
  var selected = document.getElementById("age").value;
  var start =
    document.getElementById("start").value ||
    moment("01/01/1800", "DD/MM/YYYY").format("YYYY-MM-DD");

  var end =
    document.getElementById("end").value ||
    moment("31/12/" + moment().add(2000, "year").year(), "DD/MM/YYYY");

  var tddate, tdage, ageValue, dateValue;

  for (i = 0; i < tr.length; i++) {
    tdage = tr[i].getElementsByTagName("td")[ageColumn];//[2]
    tddate = tr[i].getElementsByTagName("td")[dateColumn];//[6]
    if (tdage && tddate) {
      ageValue = parseInt(tdage.textContent);
      dateValue = tddate.innerText;

      if (start && end && selected) {
        // [] indicates that the start and end dates are includered in the range

        if (
          moment(dateValue, "DD/MM/YYYY").isBetween(start, end, "days", "[]") &&
          selected != "all"
        ) {
          switch (selected) {
            case "above":
              if (ageValue >= age) {
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }
              break;
            case "below":
              if (ageValue <= age) {
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }
              break;
          }
        } else if (
          moment(dateValue, "DD/MM/YYYY").isBetween(start, end, "day", "[]")
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } else {
        tr[i].style.display = "";
      }
    }
  }
}
function filterAge(age) {
  var selected = document.getElementById("age").value || "all";
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      txtValue = parseInt(td.textContent);
      if (selected === "all") {
        tr[i].style.display = "";
      } else {
        if (selected === "above") {
          if (txtValue >= age) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (selected === "below") {
          if (txtValue <= age) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
}
function filterActe(idSelect, idColumn) {
  var selected = document.getElementById(idSelect).value;

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[idColumn];
    if (td) {
      txtValue = td.textContent.toLowerCase().trim();

      switch (selected) {
        case "all":
          tr[i].style.display = "";
          break;
        case "chirurgie":
          if (txtValue === "chirurgie") {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
          break;
        case "consultation":
          if (txtValue === "consultation") {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
          break;
        case "kt":
          if (txtValue === "kt") {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
          break;
        case "no-acte":
          if (txtValue === "/") {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
          break;
      }
    }
  }
}

function filterDate() {
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[6];
    if (td) {
      txtValue = td.textContent.toString();

      if (start && end) {
        // [] indicates that the start and end dates are includered in the range
        if (moment(txtValue).isBetween(start, end, "day", "[]")) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      } else {
        tr[i].style.display = "";
      }
    }
  }
}
