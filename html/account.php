<?php
	session_start();

	if(!isset($_SESSION['userID'])){ // not logged in
		header('Location: ../index.php');
	}
	include 'config.php';

	
	// PREPARE TO SHOW PAGE
	$string = '';
	$hasCharacters = 0;
	$result = $mysqli -> query("SELECT charID, charName FROM myCharacters WHERE userID = {$_SESSION['userID']};");
	if($result -> num_rows != 0) {
		$hasCharacters = 1;
		while($row = $result -> fetch_array()) {
			$string .= "<option value='{$row['charID']}'>".$row['charName']."</option>\n";
		}
	}
	// $result -> free();

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
	if($hasCharacters == 0) {
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

	// print_r($_SESSION);

	if(isset($_SESSION['characterCreated'])) {
		echo "{$_SESSION['characterName']} was born from the ashes.";
		unset($_SESSION['characterCreated']);
		unset($_SESSION['characterName']);
	}
?>

	<form id='character_selection' class='container' method='POST' action='./account_select.php'>
		<p>Select your character:</p>
		<select id='character' name='character'>
			<?php echo $string; ?>
		</select>
		<div>
			<button id='select'>Enter the game</button>
		</div>
	</form>
	<form id='character_creation' class='container' method='POST' action='./account_create.php'>
		<p>Create new character:</p>
		<div>
			<span>Name: </span><input name='nick' placeholder="Your character's name">
			<?php
				if(isset($_SESSION['nickTaken'])) {
					echo '<g>' . $_SESSION['nickTaken'] . '</g>';
					unset($_SESSION['nickTaken']);
				}
			?>
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