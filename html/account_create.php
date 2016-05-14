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

		$result = $mysqli -> query("SELECT COUNT(id) ile FROM characters WHERE name = '{$nick}'");
		$row = $result -> fetch_assoc();
		if($row['ile']) {
			echo "Sadly, this nick was already taken.";
			return;
		}

		// user created new character
		$mysqli -> query("INSERT INTO characters(name) VALUES ('{$nick}')");
		$id = $mysqli -> insert_id;
		echo $_SESSION['user'] . ', ' . $_SESSION['login'] . ', ' . $nick;
		$mysqli -> query("INSERT INTO users_characters(`user`, `character`) VALUES ('{$_SESSION['user']}', '{$id}')");
		$_SESSION['new_character'] = true;
		$_SESSION['new_character_name'] = $nick;
	}
	create($mysqli, $_POST);
	header("location: ./account.php");
?>