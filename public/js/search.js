var input, filter, table, tr, td, i, j, txtValue;
input = document.getElementById("search");
filter = input.value.toUpperCase();
table = document.getElementById("tablebody");
tr = table.getElementsByTagName("tr");


function searchTable() {
    
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")
    console.log(td.length)
    for (j = 0; j < td.length; j++) {
        
        checkColumn(i,j);
    }
  }
}

function checkColumn(v,h) {
    console.log(v,h)
    td = tr[v].getElementsByTagName("td")[h];
    console.log(td.textContent)
  if (td) {
    txtValue = td.textContent || td.innerText;
    // console.log("value:",txtValue.toUpperCase())
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
        console.log("Exist")
      tr[v].style.display = "";
    } else {
      tr[v].style.display = "none";
    }
  }
}
