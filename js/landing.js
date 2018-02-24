$(document).ready(function() { 
console.log('loaded!');

//initiate photo rotator
var infiniteRotator = {
init: function() {
//define the initial fade in time
var initialFadeIn = 1000;
//define the length which the photo appears before changing
var itemInterval = 4500;
//define the length of the fade in and out time
var fadeTime = 2500;
//define the number of items with 'rotating-item' classes  
var numberOfItems = $('.rotating-item').length;
//define the 
var currentItem = 0;

$('.rotating-item').eq(currentItem).fadeIn(initialFadeIn);

var infiniteLoop = setInterval(function() {
$('.rotating-item').eq(currentItem).fadeOut(fadeTime);
if(currentItem === numberOfItems - 1) {
	currentItem = 0;
} else {
	currentItem++;
}
$('.rotating-item').eq(currentItem).fadeIn(fadeTime);
}, itemInterval);
}
};
infiniteRotator.init();

$('.accordion-one').click(showSpring);

function showSpring () {
	var springTitle = $('.accordion-one');
	var springIntro = $(springTitle).parent().find('.spring');

	if ($(springIntro).data('state') === 'hidden') {
		$(springIntro).data('state', 'show');
		$(springIntro).slideDown();
	} else {
		$(springIntro).data('state', 'hidden');
		$(springIntro).slideUp();
	}
}

$('.accordion-two').click(showSummer);

function showSummer () {
	var summerTitle = $('.accordion-two');
	var summerIntro = $(summerTitle).parent().find('.summer');

	if ($(summerIntro).data('state') === 'hidden') {
		$(summerIntro).data('state', 'show');
		$(summerIntro).slideDown();
	} else {
		$(summerIntro).data('state', 'hidden');
		$(summerIntro).slideUp();
	}
}

$('.accordion-three').click(showAutumn);

function showAutumn () {
	var autumnTitle = $('.accordion-three');
	var autumnIntro = $(autumnTitle).parent().find('.autumn');

	if ($(autumnIntro).data('state') === 'hidden') {
		$(autumnIntro).data('state', 'show');
		$(autumnIntro).slideDown();
	} else {
		$(autumnIntro).data('state', 'hidden');
		$(autumnIntro).slideUp();
	}
}

$('.accordion-four').click(showWinter);

function showWinter () {
	var winterTitle = $('.accordion-four');
	var winterIntro = $(winterTitle).parent().find('.winter');

	if ($(winterIntro).data('state') === 'hidden') {
		$(winterIntro).data('state', 'show');
		$(winterIntro).slideDown();
	} else {
		$(winterIntro).data('state', 'hidden');
		$(winterIntro).slideUp();
	}
}

// $('.arrow-left').click(function() {
// 	var activeImage = $('.img-wrapper').children('img.active');
// 	activeImage.removeClass('active');
// 	if (activeImage.next().length > 0) {
// 		activeImage.next().addClass('active');
// 		$('.img-wrapper').children('img:first-child').addClass('inactive');
// 	} else {
// 		$('.img-wrapper').children('img:first-child').addClass('active');
// 		$('.img-wrapper').children('img:first-child').removeClass('inactive');
// 	}
// });

var currentIndex = 0,
	items = $('.img-wrapper img'),
	itemAmt = items.length;

function cycleItems() {
	var item = $('.img-wrapper img').eq(currentIndex);
	items.hide();
	item.css('display', 'inline-block');
}

$('.arrow-left').click(function() {
	currentIndex = currentIndex + 1;
	if (currentIndex > itemAmt - 1) {
		currentIndex = 0;
	}
	cycleItems();
});

$('.arrow-right').click(function() {
	currentIndex = currentIndex - 1;
	if (currentIndex < 0) {
		currentIndex = itemAmt - 1;
	}
	cycleItems();
});


});