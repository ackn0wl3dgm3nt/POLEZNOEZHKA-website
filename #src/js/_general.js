@@include('_webp.js')

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