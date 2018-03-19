var burger = document.querySelector('.burger');
var select = document.getElementById("prompt-select");
var burgerCheck = document.getElementById('burger-check');


function togglePrompt(){
if(burger.classList.contains('animated')){
		burger.classList.remove('animated');
		burgerCheck.checked = false;
	} else {
		burger.classList.add('animated');
		burgerCheck.checked = true;
  }
  
if(burger.classList.contains('animated')) {
  console.log("true");
  burgerCheck.checked = false;
} else { 
  console.log("false");
  burgerCheck.checked = true;
}

	if(select.classList.contains('animated')) { 
		select.classList.remove('animated');
	} else {
		select.classList.add('animated'); 
	}
}

togglePrompt();
burger.addEventListener("click", togglePrompt);



