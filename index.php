<?php
	session_start();
	if(isset($_SESSION['user'])){
		header('Location: html/account.php');
	}

	include 'html/config.php';
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset='UTF-8'>
	<link type='text/css' rel='stylesheet' href='css/login.css'>
	<link type='text/css' rel='stylesheet' href='css/forms.css'>
	<link type='text/css' rel='stylesheet' href='css/keyframes.css'>
	<style>
		g { color: green }
		r { color: red }
	</style>

<?php $data = login($mysqli); ?>

</head>
<body>

<form class='form appear' method='POST' action='index.php'>
	<div class='form-head'>
		<h2>Login</h2>
		<b><?php echo $data ?></b>
	</div>
	<div class='form-body'>
		<div class='form-body-left'>
			<span>Login:</span>
			<span>Password:</span>
		</div>
		<div class='form-body-right'>
			<input autocomplete='off' name='login'>
			<input autocomplete='off' name='password' type='password'>
		</div>
	</div>
	<div class='form-bottom'>
		<input name='button:login' value='Let me in' type='submit'>
		<input name='button:register' value='Register (use given credentials)' type='submit'>
	</div>
</form>
</body>
</html>