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
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset='UTF-8'>
	<link rel='stylesheet' href='../client/css/classes.css' type='text/css'>
	<link rel='stylesheet' href='../client/css/ids.css' type='text/css'>
	<link rel='stylesheet' href='../client/css/tags.css' type='text/css'>

	<script src='/Libraries/Mithril.js/mithril.min.js'></script>
</head>
<body>
	<div id='chat'></div>
	<div id='character_stats'></div>
	<div id='character'>
		<table id='table-equipment' border='1'></table>
		<hr>
		<table id='table-inventory' border='1'></table>	
	</div>
	
	<button id='logout'>Logout</button>
</body>
	<?php
		if(isset($_SESSION['userID'])){
			echo "<script>const USER_ID = parseInt(" . $_SESSION['userID'] . ");</script>\n";
			echo "<script>const CHARACTER_ID = parseInt(" . $_SESSION['character'] . ");</script>\n";
		}
	?>
	<script src='/Libraries/Mithril.js/mithril.min.js'></script>

	<script src="../client/js/drag.js"></script>
	<script src="../client/js/player.js"></script>

	<script src="../client/js/channel.js"></script>
	<script src="../client/js/interface/equipment.js"></script>
	<script src="../client/js/interface/inventory.js"></script>
	<script src="../client/js/interface/stats.js"></script>
	<script src="../client/js/interface/chat.js"></script>
	<script src="../client/js/main.js"></script>
</html>
