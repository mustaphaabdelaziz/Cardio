
const opt = document.querySelector("#medecin");
const personal = document.getElementById("#personal");
opt.value = tabib;
opt.options[opt.selectedIndex].defaultSelected = true;
personal.reset();
