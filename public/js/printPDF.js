function printPDF() {
    html2canvas(document.getElementById('printContent'), {height: document.body.clientHeight, width: document.body.clientWidth}).then(function (canvas) {
      // document.body.appendChild(canvas);
      var wid;
      var hgt;
  
      var img = canvas.toDataURL("image/png", wid = canvas.width, hgt = canvas.height);
      var hratio = hgt / wid
      var doc = new jsPDF('p', 'pt', 'a4');
      var width = doc.internal.pageSize.width;
      var height = width * hratio
      doc.addImage(img, 'JPEG', 20, 20, width, height);
      doc.save('Test.pdf');
    });
  
  }
