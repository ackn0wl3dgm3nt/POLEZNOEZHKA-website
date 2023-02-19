function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else{
		document.querySelector('body').classList.add('no-webp');
	}
});

$('.slow-scroll').on('click', function() {
	let href = $(this).attr('href') || $(this).attr('data-href');
	let offset = $('.header').height() + 0;

	$('html, body').animate({
		scrollTop: $(href).offset().top - offset
	}, 800);
	setTimeout(function() {
		$('.sidenav').removeClass('sidenav_active');
		$('.header__burg').removeClass('header__burg_active');
	}, 900);
});

$(document).on('scroll', function() {
	if ( $(window).scrollTop() >= 400 )
		$('header').addClass('header_fixed');
	else
		$('header').removeClass('header_fixed');
});

let cart = {};

function showMiniCart() {

	if ( !isEmpty(cart) ) {
		$('.mini-cart__body').html('<p class="mini-cart__empty">Корзина пуста. <a href="index.html#catalog">Перейти в каталог</a></p>');
		$('.mini-cart__action').hide();
		return;
	}

	let out = '';

	for (let key in cart) {

		out += `
			<div class="item-mini-cart">
				<div class="item-mini-cart__amount">
					<i class="fas fa-plus" data-id="${key}"></i>
					<span>${cart[key]['amount']}</span>
					<i class="fas fa-minus" data-id="${key}"></i>
				</div>
				<div class="item-mini-cart__img">
					<img src="${cart[key]['img']}" alt="">
				</div>
				<div class="item-mini-cart__info">
					<h3 class="item-mini-cart__title">${cart[key]['name']}</h3>
					<p class="item-mini-cart__cost">${cart[key]['cost'] * cart[key]['amount']}₽</p>
				</div>
				<div class="item-mini-cart__delete" data-id="${key}">
					<i class="fas fa-trash-alt"></i>
				</div>
			</div>
		`;

	}

	let total = 0;

	for ( let key in cart ) {
		total += cart[key].cost * cart[key].amount;
	}

	$('.mini-cart__body').html(out);
	$('.mini-cart__action').show();
	$('.mini-cart__total').text(total + '₽');

	$('.fa-plus').on('click', plusGoods);
	$('.fa-minus').on('click', minusGoods);
	$('.item-mini-cart__delete').on('click', delGoods);
}

function loadCart() {
	if (localStorage.getItem('cart')) {
		cart = JSON.parse(localStorage.getItem('cart'));
		showMiniCart();
	}
}

function saveCart() {
	localStorage.setItem('cart', JSON.stringify(cart));
}

function delGoods() {
	let id = $(this).attr('data-id');

	delete cart[id];
	saveCart();
	showMiniCart();
}

function plusGoods() {
	let id = $(this).attr('data-id');

	cart[id].amount++;
	saveCart();
	showMiniCart();
}

function minusGoods() {
	let id = $(this).attr('data-id');

	if (cart[id].amount == 1) {
		delete cart[id];
	} else {
		cart[id].amount--;
	}

	saveCart();
	showMiniCart();
}

function isEmpty(obj) {
	for (let key in obj) {
		return true;
	}

	return false;
}

$(document).ready(function() {

	loadCart();

	let general = function() {

		$('.header__cart').on('click', () => $('.mini-cart').toggleClass('mini-cart_active'));
		$('.mini-cart__close').on('click', () => $('.mini-cart').removeClass('mini-cart_active'));

		$('.header__burg').on('click', function() {
			$(this).toggleClass('header__burg_active');
			$('.sidenav').toggleClass('sidenav_active');
		});
		$('.sidenav__close').on('click', function() {
			$('.sidenav').removeClass('sidenav_active');
			$('.header__burg').removeClass('header__burg_active');
		});

		if ( $(window).width() <= '600' ){
			$('.mini-cart__empty').click(() => $('.mini-cart').removeClass('mini-cart_active'));
		}

	}

	general();
});

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