// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
$(document).ready(function () {
  $("#confirmedPassword").on("keyup", function () {
    var password = $("#registerPassword").val();
    var confirmPassword = $("#confirmedPassword").val();
    if (password != confirmPassword)
      $("#checkPasswordMatch")
        .html("Le mot de passe ne correspond pas !")
        .css("color", "red");
    else
      $("#checkPasswordMatch").html("Correspondance du mot de passe !").css("color", "green");
  });
});
