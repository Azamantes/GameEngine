<?php
	session_start();

	if(!isset($_SESSION['userID'])){ // not logged in
		header('Location: ../index.php');
	}
	if(!isset($_SESSION['character']) && !isset($_POST['character'])){
		header('Location: ./account.php');
	}
	if(isset($_POST['character'])) {
		$_SESSION['character'] = $_POST['character'];
	}
	header('Location: ./main.php');
?>