<?php
	include 'config.php';
	session_start();
	if(isset($_SESSION['userID'])){
		$mysqli -> query("UPDATE users SET status = 0 WHERE id = {$_SESSION['userID']};");
		$mysqli -> close();
	}
	unset($_SESSION['userID']);
	unset($_SESSION['character']);
	header('Location: ../index.php');
?>