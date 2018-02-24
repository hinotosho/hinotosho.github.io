
$(function() {
//caching
//the main wrapper of the gallery
	var $fp_gallery			= $('#fp_gallery')
	//the overlay when the large image is displayed
	var $fp_overlay			= $('#fp_overlay');
	//image loading status
	var $fp_loading			= $('#fp_loading');
	//the next and previous buttons
	var $fp_next			= $('#fp_next');
	var $fp_prev			= $('#fp_prev');
	//the close button
	var $fp_close			= $('#fp_close');
	//the main container for the thumbs structure
	var $fp_thumbContainer 	= $('#fp_thumbContainer');
	//wrapper of jquery ui slider
	var $fp_scrollWrapper	= $('#fp_scrollWrapper');
	//total number of images
	var nmb_images=0;
	//which gallery is clicked (index)
	var gallery_idx=-1;
	//scroller wrapper
	var $fp_thumbScroller	= $('#fp_thumbScroller');
	//jquery ui slider
	var $slider				= $('#slider');
	//the links of the galleries (the cities)
	var $fp_galleries		= $('#fp_galleryList > li');
	//current image being viewed
	var current				= 0;

	var windowH = $(window).height();
	var windowS = $(window).scrollTop();
	var windowW = $(window).width();
	//some control flags:
	//prevent fast clicks on next and previous
	var photo_nav			= true;
	
	//user clicks on a gallery (one of the four seasons)
	$fp_galleries.bind('click', function(){
		$fp_galleries.removeClass('current');
		var $gallery = $(this);
		$gallery.addClass('current');
		var gallery_index = $gallery.index();
		if(gallery_idx === gallery_index) return;
		gallery_idx = gallery_index;
	// console.log('hello', gallery_idx);
	//close the gallery and slider if they are opened
	if ($fp_thumbContainer.data('opened') === true) {
		$fp_scrollWrapper.fadeOut();
		$fp_thumbContainer.stop().animate({'height': '0px'}, 200, function() {
			openGallery($gallery);
		});
	} else 
	openGallery($gallery);
	});
		
	//opens a gallery after clicking on the gallery title
	function openGallery($gallery) {
		current = 0;
		$fp_content_wrapper = $fp_thumbContainer.find('.container:nth-child('+parseInt(gallery_idx+1)+')');
		$fp_thumbContainer.find('.container').not($fp_content_wrapper).hide();
		$fp_content_wrapper.show();
		nmb_images = $fp_content_wrapper.children('div').length;
		var w_width = 0;
		var padding_l = 0;
		var padding_r = 0;
		var center = $(window).width()/2;
		var one_divs_w = 0;

		$fp_content_wrapper.children('div').each(function(i) {
			var $div = $(this);
			var div_width = $div.width();
			w_width = div_width + w_width;
			if (i === 0) {
				padding_l = center - (div_width/2);
			}
			if (i === (nmb_images - 1)) {
				padding_r = center - (div_width/2);
				one_divs_w = div_width;
			}
		}).end().css({
			'width': w_width +'px',
			'padding-left': padding_l + 'px',
			'padding-right': padding_r + 'px'
		});
	//scroll all left
	$fp_thumbScroller.scrollLeft(w_width);
	$slider.slider('destroy').slider({
	orientation: 'horizontal',
	max: w_width - one_divs_w,
	min: 0,
	value: 0,
	slide: function(event, ui) {
	$fp_thumbScroller.scrollLeft(ui.value);
	},
	stop: function(event, ui) {
	checkClosest();
	}
	});

	$fp_thumbContainer.animate({'height': '240px'}, 200, function() {
	$(this).data('opened', true);
	$fp_scrollWrapper.fadeIn();
	});

	$fp_thumbScroller.stop().animate({'scrollLeft': '0px'}, 2000, 'easeInOutExpo');

	$fp_content_wrapper.find('.content').bind('click', function(e) {
	var $current = $(this);
	current = $current.index();
	centerImage($current,true,600);
	e.preventDefault();
	});
	}

	$fp_thumbScroller.scroll(function() {
	$slider.slider('value', parseInt($fp_thumbScroller.scrollLeft(), 10));
	});


	//user clicks next button (preview mode)
	$fp_next.bind('click', function() {
		if (photo_nav) {
			photo_nav = false;
			navigate(1);
		}
	});

	$fp_prev.bind('click', function() {
		if (photo_nav) {
			photo_nav = false;
			navigate(0);
		}
	});
	
	//User clicks next button (thumbs)
	$('#fp_next_thumb').click(function() {
		slideThumb(1);
	});

	//User clicks previous button (thumbs)
	$('#fp_prev_thumb').click(function() {
		slideThumb(0);
	});
	
	//user clicks close button
	$fp_close.bind('click', function() {
		if (!photo_nav) return;
		//window scroll if any
		var windowS = $(window).scrollTop;
		var $large_img = $('#fp_preview');
		var $current = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx + 1)+')').find('.content:nth-child('+parseInt(current + 1)+')');
		//offset values of current thumb
		var current_offset = $current.offset();
		//the large image will animate in the direction of the center
		//after that it is removed from the DOM
		$large_img.stop().animate({
			'top': current_offset.top + windowS +'px',
			'left': $(window).width()/2 - $current.width()/2 + 'px',
			'width': $current.width() + 'px',
			'height': $current.height() + 'px',
			'opacity': 0
		}, 800, function() {
			$(this).remove();
			//hide the overlay, next, previous and close functions
			hidePreviewFunctions();
		});
	});

	//centers an image and opens it if open is true
	function centerImage($obj,open,speed){
		//the offset left of the element
		var obj_left 			= $obj.offset().left;
		//the center of the element is its offset left plus 
		//half of its width
		var obj_center 			= obj_left + ($obj.width()/2);
		//the center of the window
		var center				= $(window).width()/2;
		//how much the scroller has scrolled already
		var currentScrollLeft 	= parseFloat($fp_thumbScroller.scrollLeft(),10);
		//so we know that in order to center the image,
		//we must scroll the center of the image minus the center of the screen,
		//and add whatever we have scrolled already
		var move 				= currentScrollLeft + (obj_center - center);
		if(move != $fp_thumbScroller.scrollLeft()) //try 'easeInOutExpo'
			$fp_thumbScroller.stop()
		.animate({scrollLeft: move}, speed,function(){
			if(open)
				enlarge($obj);
		});
		else if(open)
			enlarge($obj);
	}
	
	//shows the large image
	//first we position the large image on top of the thumb
	//and then, we animate it to the maximum we can get 
	//based on the windows size
	function enlarge($obj) {
	//the image element
	var $thumb = $obj.find('img');
	//show loading image
	$fp_loading.show();
	//preload large image
	$('<img id="fp_preview" />').load(function() {
	var $large_img = $(this);
	//confirm there's no other large img
	$('#fp_preview').remove();
	$large_img.addClass('fp_preview');
	//we will position this image on top of the thumb
	//we will append this image to fp_gallery div
	var obj_offset = $obj.offset();
	$large_img.css({
	'width': $thumb.width() + 'px',
	'height': $thumb.width() + 'px',
	'top': obj_offset.top + 'px',
	'left': obj_offset.left + 5 +'px'
	}).appendTo($fp_gallery);

	getFinalValues($large_img);
	var largeW = $large_img.data('width');
	var largeH = $large_img.data('height');
	//windows width, height and scroll
	var $window = $(window);
	var $windowW = $(window).width();
	var $windowH = $(window).height();
	var $windowS = $(window).scrollTop();
	//hide the image loading
	$fp_loading.hide();
	//show the overlay
	$fp_overlay.show();
	//now animate the large image
	$large_img.stop().animate({
	'top': windowH/2 - largeH/2 + 'px',
	'left': windowW/2 - largeW/2 + 'px',
	'width': largeW + 'px',
	'height': largeH + 'px',
	'opacity': 1
	}, 800, function() {
	//after the animation,
	//show the next, previous and close buttons
	showPreviewFunctions();
	});
	}).attr('src', $thumb.attr('alt'));
	}

	//shows next or previous image
	//1 is right, 0 is left
	function navigate(way) {
		//show loading image
		$fp_loading.show();
		if (way === 1) {
			++current;
			var $current = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx + 1)+')').find('.content:nth-child('+parseInt(current + 1)+')');
			if ($current.length === 0) {
				--current;
				$fp_loading.hide();
				photo_nav = true;
				return;
			}
		} else {
			--current;
			var $current = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx + 1)+')').find('.content:nth-child('+parseInt(current + 1)+')');
			if ($current.length === 0) {
				++current;
				$fp_loading.hide();
				photo_nav = true;
				return;
			}
		} console.log('count', $current);
	
	//load large img of next of previous content div
	$('<img id="fp_preview" />').load(function() {
		$fp_loading.hide();
		var $large_img = $(this);
		var $fp_preview = $('#fp_preview');
		//make the current image slide left if clicking next
		//make the current image slide right if clicking previous
		var animate_to = -$fp_preview.width();
		var animate_from = $(window).width();
		if (way === 0) {
			animate_to = $(window).width();
			animate_from = -$fp_preview.width();
		}
		//we want the thumb of the last image viewed stays centered on the screen
		centerImage($current, false, 1000);
		$fp_preview.stop().animate({'left': animate_to + 'px'}, 500, function() {
			$(this).remove();
			$large_img.addClass('fp_preview');
			getFinalValues($large_img);
			var largeW = $large_img.data('width');
			var largeH = $large_img.data('height');
			var $window = $(window);
			var windowW = $window.width();
			var windowH = $window.height();
			var windowS = $window.scrollTop();
			$large_img.css({
				'width': largeW + 'px',
				'height': largeH + 'px',
				'top': windowH/2 - largeH/2 + 'px',
				'left': animate_from + 'px',
				'opacity': 1
			}).appendTo($fp_gallery).stop().animate({
				'left': windowW/2 - largeW/2 + 'px'
			}, 500, function() {photo_nav = true;});
		});
	}).attr('src', $current.find('img').attr('alt'));
} 

	//show the next, previous and close buttons
	function showPreviewFunctions() {
		$fp_next.stop().animate({'right':'0px'},500);
		$fp_prev.stop().animate({'left':'0px'},500);
		$fp_close.show();
	}

	//hide the overlay, and the next, previous and close buttons
	function hidePreviewFunctions() {
	$fp_next.stop().animate({'right':'-50px'},500);
	$fp_prev.stop().animate({'left':'-50px'},500);
	$fp_close.hide();
	$fp_overlay.hide();
	}

	function getFinalValues($image) {
	var widthMargin = 0;
	var heightMargin = 20;
	var $window = $(window);
	var windowH = $window.height() - heightMargin;
	var windowW = $window.width() - widthMargin;
	var theImage = new Image();
	theImage.src = $image.attr("src");
	var imgWidth = theImage.width;
	var imgHeight = theImage.height;

	if ((imgWidth > windowW) || (imgHeight > windowH)) {
	if (imgWidth > imgHeight) {
	var newwidth = windowW;
	var ratio = imgWidth / windowW;
	var newheight = imgHeight / ratio;
	theImage.height = newheight;
	theImage.width = newwidth;
	if (newheight > windowH) {
	var newnewheight = windowH;
	var newratio = newheight/windowH;
	var newnewwidth = newwidth/newratio;
	theImage.width = newnewwidth;
	theImage.height = newnewheight;
	}
	} else {
	var newheight = windowH;
	var ratio = imgHeight / windowH;
	var newwidth = imgWidth / ratio;
	theImage.height = newheight;
	theImage.width = newwidth;
	if (newwidth > windowW) {
	var newnewwidth = windowW;
	var newratio = newwidth/windowW;
	var newnewheight = newheight/newratio;
	theImage.height = newnewheight;
	theImage.width = newnewwidth;
	}
	}
	}
	$image.data('width', theImage.width);
	$image.data('height', theImage.height);
	}

	//slides scroller one picture to the right or left
	function slideThumb(way) {
	if (way === 1) {
	++current;
	var $next = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx + 1)+')').find('.content:nth-child('+parseInt(current + 1)+')');
	if ($next.length > 0)
	centerImage($next,false,600);
	else {
	--current;
	return;
	}
	} else {
	--current;
	var $prev = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx + 1)+')').find('.content:nth-child('+parseInt(current + 1)+')');
	if ($prev.length > 0)
	centerImage($prev,false,600);
	else {
	++current;
	return;
	}
	}
	}

	function checkClosest() {
	var center = $(window).width()/2;
	var current_distance = 99999999;
	var idx = 0;
	$container = $fp_thumbScroller.find('.container:nth-child('+parseInt(gallery_idx + 1)+')');
	$container.find('.content').each(function(i) {
	var $obj = $(this);
	//the offset left of the element
	var obj_left = $obj.offset().left;
	//the center of the element is its offset left plus half of its width
	var obj_center = obj_left + ($obj.width()/2);
	var distance = Math.abs(center - obj_center);
	if (distance < current_distance) {
	current_distance = distance;
	idx = i;
	}
	});
	var $new_current = $container.find('.content:nth-child('+parseInt(idx + 1)+')');
	current = $new_current.index();
	centerImage($new_current,false,200);
	}
});
