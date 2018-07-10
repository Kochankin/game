const scrollTime = 1500;
const scrollHeight = 100;
const resizeWidth = 720;
const hideMenuHeight = 400;
const timeToRemoveClass = 400;

// For scrolling up a page on menu clicking 
$(document).ready(function(){
	$("#menu").on("click","a", function (event) {
		event.preventDefault();
		const id  = $(this).attr('href'),
			  top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, scrollTime);
	});
});

// For scrolling page to top
window.onscroll = function() {
	const scrollArrow = document.querySelector('.scroll-arrow');
	scrollArrow.onclick = function() {
        $('body,html').animate({scrollTop: 0}, scrollTime);
	}
	if (window.scrollY >= scrollHeight) {
		scrollArrow.classList.add("scroll-up");
	} else {
		scrollArrow.classList.remove("scroll-up");
	}
} 

// Hide menu if it is opened and window is resized
window.onresize = function() {
	if (window.innerWidth < resizeWidth && !document.querySelector('#menu').classList.contains('open')){
		$("#menu").slideUp();
		document.querySelector('#menu').style.display = "none";
		document.querySelector('#menu').classList.remove('open');	
	} else {
		document.querySelector('#menu').style.display = "flex";
		if (document.querySelector('#menu').classList.contains('open')) {
			hideMenu();		
		}
	}
}

//Hide menu
function hideMenu() {
	const cross = document.querySelector('.fa-times');
	const promise = new Promise((resolve) => {
	if (cross) {
		cross.parentElement.removeChild(cross);
		setTimeout(() => {resolve();}, timeToRemoveClass);
	}	
  });
  promise.then(() => document.querySelector('#menu').classList.remove('open'));
}

// Slide top menu
document.querySelector('.burger').addEventListener('click', openMenu);
function openMenu(){
    const ul = document.querySelector('ul');
    const cross = document.createElement('i');
    cross.classList.add('fas');
    cross.classList.add('fa-times');
	ul.after(cross);
	$("ul").slideDown(hideMenuHeight);
	ul.classList.add('open');
    cross.addEventListener('click', function(){
		$("ul").slideUp(hideMenuHeight);
		hideMenu();
	} );
}