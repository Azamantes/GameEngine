<?php
	include 'config.php';
	session_start();

	function create($mysqli, $POST) {
		$new = isset($POST['nick']);
		if(!$new) {
			return;
		}

		$nick = clear($POST['nick']);
		if(!$nick) {
			return;
		}

		$result = $mysqli -> query("SELECT id FROM characters WHERE name = '{$nick}'");
		if($result -> num_rows != 0) {
			$_SESSION['nickTaken'] = "Sadly, this nick was already taken.";
			return;
		}

		// user created new character
		$mysqli -> query("INSERT INTO characters(name) VALUES ('{$nick}')");
		$id = $mysqli -> insert_id;
		$mysqli -> query("INSERT INTO locations_characters(`location`, `character`) VALUES (1, {$id})");
		$mysqli -> query("INSERT INTO users_characters(`user`, `character`) VALUES ({$_SESSION['userID']}, {$id})");
		$_SESSION['characterCreated'] = true;
		$_SESSION['characterName'] = $nick;
	}
	create($mysqli, $_POST);
	header("location: ./account.php");
?>