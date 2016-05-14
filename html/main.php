<?php
	session_start();

	if(!isset($_SESSION['user'])){ // not logged in
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
	<!-- <link rel='stylesheet' href='engine.css' type='text/css'> -->
	<!-- <script src="game_project.js"></script> -->
<!-- 	<script src="engine/channel.js"></script>
	<script src="engine/check.js"></script>
	<script src="engine/equipment.js"></script>
	<script src="engine/character.js"></script>
	<script src="engine/location.js"></script>
	<script src="engine/team.js"></script>
	<script src="engine/guild.js"></script> -->
	<!-- <script src="engine/items/item.js"></script> -->
	<!-- <script src="engine/inventory.js"></script> -->
<style>
	body {
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none;
		/*position: relative;*/
	}
	table {
		outline: 1px solid grey;
		background: lightgrey;
		padding: 0px;
		clear: both;
	}
	td {
		float: left;
		display: block;
		width: 32px;
		height: 32px;
		padding: 0px;
		margin-left: 2px;
		background: white;
	}
	td:first-child {
		margin-left: 0px;
	}
	.form {
		width: 300px;
	}
	.form-element {
		clear: both;
	}
	.form-element > span {
		float: left;
		clear: right;
	}
	.form-element > input {
		float: right;
	}
	#logout {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>

</head>
<body>
<!-- <div class='form'>
	<div class='form-element'><span>ID: </span><input id='playerID' placeholder='Your ID'></div>
	<div class='form-element'><span>Nickname: </span><input id='playerName' placeholder='Your nickname'></div>
	<div class='form-element'><span>Location: </span><input id='playerLocation' placeholder='Your location'></div>
	<div class='form-element'><input type='button' id='connect' value='Connect'></div>
</div> -->

<div id='messages'></div>

<style>
	.invisible {
		visibility: hidden;
	}
	/*#equipment_container {
		position: absolute;
		top: 10px;
		right: 10px;
	}*/
</style>

<table id='equipment_container' border='1'>
	<tbody id='equipment'>
		<tr> 
			<td class='invisible'></td>
			<td class='eq-head item'></td>
			<td class='invisible'></td>
		</tr>
		<tr>
			<td class='eq-ring-1 item'></td>
			<td class='eq-neck item'></td>
			<td class='eq-ring-2 item'></td>
		</tr>
		<tr>
			<td class='eq-hand-l item'></td>
			<td class='eq-chest item'></td>
			<td class='eq-hand-r item'></td>
		</tr>
		<!-- <tr>
			<td class='eq-hand-l item'><img id='item#1' src='sword1.png'></td>
			<td class='eq-chest item'></td>
			<td class='eq-hand-r item'><img id='item#1' src='sword1.png'></td>
		</tr> -->
		<tr>
			<td class='eq-gloves item' title='Place for your gloves.'></td>
			<td class='eq-pants item'></td>
			<td class='eq-waist item'></td>
		</tr>
		<tr>
			<td class='invisible'></td>
			<td class='eq-waist item'></td>
			<td class='invisible'></td>
		</tr>
		<tr>
			<td class='invisible'></td>
			<td class='eq-boots item'></td>
			<td class='invisible'></td>
		</tr>
	</tbody>
</table>

<table border='1'>
	<tbody id='inventory'>
		<!-- <tr>
			<td class='inv-item'><img id='item#1' src='sword1.png' class='item'></td>
			<td class='inv-item'><img id='item#2' src='sword2.png' class='item'></td>
			<td class='inv-item'><img id='item#3' src='sword3.png' class='item'></td>
			<td class='inv-item'><img id='item#4' src='sword4.png' class='item'></td>
			<td class='inv-item'><img id='item#5' src='sword5.png' class='item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr> -->
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
		<tr>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
			<td class='inv-item'></td>
		</tr>
	</tbody>
</table>



<!-- <div id='inventory'></div> -->
<button id='logout'>Logout</button>
</body>
</html>
<!-- <script src="engine/world.js"></script> -->

<?php
	if(isset($_SESSION['user'])){
		echo "<script>const USER_ID = parseInt(" . $_SESSION['user'] . ");</script>\n";
		echo "<script>const CHARACTER_ID = parseInt(" . $_SESSION['character'] . ");</script>\n";
	}
?>
<script src="../client/drag.js"></script>
<script src='../client/main.js'></script>