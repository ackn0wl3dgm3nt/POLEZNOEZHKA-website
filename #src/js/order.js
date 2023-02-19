@@include('_general.js')

function sendEmail() {

	let name = $('input[name="name"]').val();
	let patronymic = $('input[name="patronymic"]').val();
	let email = $('input[name="email"]').val();
	let phone = $('input[name="phone"]').val();
	let email_phone = $('input[name="email-phone"]').val();
	let text = $('textarea[name="text"]').val();

	if ( name != '' && patronymic != '' && (email != '' || phone != '') ) {
		if ( isEmpty(cart) ) {
			$.post(
				"core/order.php",
				{
					"name": name,
					"patronymic": patronymic,
					"email": email,
					"phone": phone,
					"email-phone": email_phone,
					"text": text,
					"cart": cart
				},
				function() {
					window.location.href = "thanks-order.html";
					localStorage.removeItem('cart');
				}
			);
		} else {
			alert('Извините, но ваша корзина пуста!');
		}
	} else {

		if ( !isEmpty(cart) ) {
			alert('Извините, но ваша корзина пуста!');
			return;
		}
	}
}

$(document).ready(function() {

	$('.home-only').hide();

	$('input[type="radio"]').on('click', function() {

		let label = $(this).attr('data-label');

		$('.email-phone-input').removeAttr('required');
		$('.email-phone-input[name="' + label + '"]').attr('required', 'required');
	});

	$('.form__submit').on('click', sendEmail);
});