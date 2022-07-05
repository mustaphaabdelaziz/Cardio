var table = document.getElementById("patientTable");
var tr = table.getElementsByTagName("tr");
var txtValue;
function filterAge(age) {
  var selected = document.getElementById("age").value;

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      console.log(td.textContent);
      txtValue = parseInt(td.textContent);
      if (selected === "all") {
        tr[i].style.display = "";
      } else {
        if (selected === "above") {
          console.log(txtValue)
          if (txtValue >= age) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        } else if (selected === "under") {
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
function filterActe(idSelect,idColumn) {
  var selected = document.getElementById(idSelect).value;
  console.log(selected);
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


function filterDate(event) {

  console.log("filterDate");
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[5];
    if (td) {
      txtValue = td.textContent.toString();
    
      if (start && end) {
       
      
        // [] indicates that the start and end dates are includered in the range
        if (moment(txtValue).isBetween(start, end, "day", "[]")) {
          console.log("good");
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
