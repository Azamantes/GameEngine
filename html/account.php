<?php
	session_start();

	if(!isset($_SESSION['user'])){ // not logged in
		header('Location: ../index.php');
	}

	include 'config.php';
	
	// PREPARE TO SHOW PAGE
	$string = '';
	$hasCharacters = false;
	$result = $mysqli -> query("SELECT c.id AS charID, c.name AS charName FROM users_characters uc, characters c WHERE uc.user = {$_SESSION['user']} AND uc.character = c.id;");
	if($result -> num_rows !== 0) {
		// $result = $result -> fetch_assoc();
		$hasCharacters = true;
		while($row = $result -> fetch_array()) {
			$string .= "<option value='{$row['charID']}'>".$row['charName']."</option>\n";
		}
	}
	$result -> free();

	$mysqli -> close();
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset='UTF-8'>


<style>
	body {
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none;
		/*position: relative;*/
	}
	#logout {
		position: absolute;
		top: 10px;
		right: 10px;
	}

<?php
	if(!$hasCharacters) {
		echo "\t#character_selection {\n\t\tdisplay: none;\n\t}\n";
	}
?>

	.container {
		outline: 1px solid grey;
		background: whitesmoke;
		padding: 15px;
		margin-bottom: 20px;
	}

</style>

</head>
<body>

<?php
	echo '<h3>Hello, '.$_SESSION['login'].'</h3>';

	if(isset($_SESSION['new_character']) && $_SESSION['new_character'] === true) {
		echo "{$_SESSION['new_character_name']} was born from the ashes.";
		unset($_SESSION['new_character']);
		unset($_SESSION['new_character_name']);
	}
?>

	<form class='container' method='POST' action='./account_select.php'>
		<p>Select your character:</p>
		<select id='character' name='character'>
			<?php echo $string; ?>
		</select>
		<div>
			<button id='select'>Enter the game</button>
		</div>
	</form>
	<form class='container' method='POST' action='./account_create.php'>
		<p>Create new character:</p>
		<div>
			<span>Name: </span><input name='nick' placeholder="Your character's name"></div>
		</div>
		<button id='create'>Create character</button>
	</form>	

<!-- <div id='inventory'></div> -->
<button id='logout'>Logout</button>
</body>
</html>
<script>
	document.getElementById('logout').addEventListener('click', function(event) {
		event.preventDefault();
		window.location.href = './logout.php';
	});
</script>