console.log(tabib);
const opt = document.querySelector("#medecin");
const personal = document.getElementById("#personal");
console.log(opt.value);
opt.value = tabib;
opt.options[opt.selectedIndex].defaultSelected = true;
personal.reset();
