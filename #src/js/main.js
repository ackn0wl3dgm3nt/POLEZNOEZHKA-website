@@include('_general.js')

function init() {
	$.getJSON('json/goods.json', goodsOut);
}

function goodsOut(data) {
	let out = '';

	for (let key in data) {
		out += `
			<div class="catalog__item" data-category="${data[key].category}">
				<div class="item-catalog">
					<div class="item-catalog__img">
						<img src="${data[key].img}" alt="">
					</div>
					<h3 class="item-catalog__title">${data[key].name}</h3>
					<p class="item-catalog__text">${data[key].description}</p>
					<p class="item-catalog__cost">${data[key].cost}₽</p>
					<div class="item-catalog__add" data-id="${key}" data-name="${data[key].name}" data-img="${data[key].img}" data-cost="${data[key].cost}">
						<i class="fas fa-cart-plus"></i>
					</div>
				</div>
			</div>
		`;
	}

	$('.catalog__row').html(out);
	$('.item-catalog__add').on('click', addToCart);
	$('.item-catalog__add').on('click', showAdded);
}

function addToCart() {

	let name = $(this).attr('data-name');
	let img = $(this).attr('data-img');
	let id = $(this).attr('data-id');
	let cost = $(this).attr('data-cost');

	if (cart[id] == undefined) {
		cart[id] = {
			name: name,
			amount: 1,
			img: img,
			cost: cost
		};
	} else {
		cart[id].amount++;
	}

	showMiniCart();
	saveCart();
}

function onload() {

	let category = $('.catalog__nav-item_active').attr('data-category');

	for ( let i = 0; i < items.length; i++ ) {
		if ( $( items[i] ).attr('data-category') == category ) {
			$( items[i] ).show();
		} else {
			$( items[i] ).hide();
		}
	}

	$('.catalog__nav-item').on('click', function(e) {

		let category = $(this).attr('data-category');

		$('.catalog__nav-item').removeClass('catalog__nav-item_active');
		$(this).addClass('catalog__nav-item_active');

		for ( let i = 0; i < items.length; i++ ) {
			if ( $( items[i] ).attr('data-category') == category ) {
				$( items[i] ).show();
			} else {
				$( items[i] ).hide();
			}
		}
	});
}

function showAdded() {
	$('.added').addClass('added_show');

	setTimeout(function() {
		$('.added').removeClass('added_show');
	}, 1000);
}

let items = $('.catalog__items');

$(document).ready(function() {

	onload();
	init();

	$("form.feedback__form").submit(function() {
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "core/mail.php",
			data: th.serialize()
		}).done(function() {
			window.location.href = "thanks-letter.html";
		});
		return false;
	});

	$('input[type="radio"]').on('click', function() {

		let label = $(this).attr('data-label');

		$('.email-phone-input').removeAttr('required');
		$('.email-phone-input[name="' + label + '"]').attr('required', 'required');
	});
});