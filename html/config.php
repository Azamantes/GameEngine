<?php
function clear($text){
	if(get_magic_quotes_gpc()){
		$text = stripslashes($text);
	}
	$text = trim($text);
	$text = htmlspecialchars($text); //dezaktywujemy kod html
	return $text;
}

$mysqli = new mysqli('localhost', 'root', '', 'gameengine');
if(mysqli_connect_errno()){
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

function login($mysqli) {
	if(!isset($_POST['login']) || !isset($_POST['password'])){
		return ''; // login or password is empty
	}

	$login = clear($_POST['login']);
	$password = clear($_POST['password']);
	
	if($login === '' || $password === ''){
		return ''; // login or password still empty x)
	}

	if(isset($_POST['button:register'])){
		$result = $mysqli -> query("SELECT id FROM users WHERE login = '{$login}';");
		if($result -> num_rows !== 0) {
			return '<r>User already exists.</r>';
		}

		$mysqli -> query("INSERT INTO users(login, password) VALUES ('{$login}', '{$password}');");
		if($mysqli -> affected_rows === 1){
			return '<g>User successfully registered.</g>'; 	
		}

		return '<r>User already exists. (impossible)</r>';
	} else if(isset($_POST['button:login'])){
		$result = $mysqli->query("SELECT id, login, status FROM users WHERE login = '{$login}' AND password = '{$password}' AND status = 0;");
		if(!$result){
	        return 'Incorrect login or password.';
		}
		
		$row = $result -> fetch_assoc();
		if($row['logged'] === '1'){
			return 'This user is already logged in.';
		}

		$_SESSION['user'] = $row['id'];
		$_SESSION['login'] = $row['login'];
		$_SESSION['userGroup'] = $row['userGroup'];
		if($_SESSION['user'] !== ''){
			$mysqli -> query("UPDATE users SET status = 1 WHERE id = '{$_SESSION['user']}';");
			$mysqli -> close();
			header("Location: ./html/account.php");
		}	
	}
}

// or die('MySQL refused to cooperate.');
?>