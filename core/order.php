<?php

$json = file_get_contents('../json/goods.json');
$json = json_decode($json, true);

if ( !isset($_POST['name'], $_POST['patronymic'], $_POST['email'], $_POST['phone'], $_POST['email-phone']) ) {
	echo "Заполните обязательные поля!";
	return false;
} else if ( !isset($_POST['cart']) ) {
	echo "Ваша корзина пуста!";
	return false;
}

$orderNumber = time();

$message = '';
$message .= '<h1>Заказ через интернет-магазин ПОЛЕЗНОЕЖКА</h1>';
$message .= '<p>Номер заказа: '.$orderNumber.'</p>';
$message .= '<p>Имя: '.$_POST['name'].'</p>';
$message .= '<p>Отчество: '.$_POST['patronymic'].'</p>';
$message .= '<p>Почта: '.$_POST['email'].'</p>';
$message .= '<p>Телефон: '.$_POST['phone'].'</p>';
$message .= '<p>Удобный способ связи: '.$_POST['email-phone'].'</p>';
$message .= '<p>Сообщение: '.$_POST['text'].'</p>';
$message .= '<h2>Корзина:</h2>';

$cart = $_POST['cart'];

$sum = 0;

foreach ($cart as $id => $count) {
	$message .= '<p>Товар: '.$json[$id]['name'].'</p>';
	$message .= '<p>Количество: '.$count['amount'].'</p>';
	$message .= '<p>Цена: '.$count['amount'] * $json[$id]['cost'].'</p>';
	$message .= '<br>';
	$sum = $sum + $count['amount'] * $json[$id]['cost'];
}

$message .= '<p>Итого: '.$sum.'</p>';

$to = 'poleznoezhka@rambler.ru'.',';
$to .= $_POST['email'];
$spectext = '<!DOCTYPE html><html lang="ru"><head><title>Заказ</title></head><body>';
$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

$m = mail($to, 'Заказ через интернет-магазин ПОЛЕЗНОЕЖКА', $spectext.$message.'</body></html>', $headers);

if ($m) {echo 1;} else {echo 0;}

?>