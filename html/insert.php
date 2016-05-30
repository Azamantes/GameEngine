<?php

	include 'config.php';


	$mysqli -> query("INSERT INTO item_grades(name) VALUES ('I')");
	$mysqli -> query("INSERT INTO item_images(source) VALUES ('sword1.png')");
	$mysqli -> query("INSERT INTO item_images(source) VALUES ('sword2.png')");
	$mysqli -> query("INSERT INTO item_materials(name) VALUES ('iron')");
	$mysqli -> query("INSERT INTO item_qualities(name) VALUES ('poor')");
	
	$mysqli -> query("INSERT INTO item_types(name) VALUES ('sword')");
	
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('helm')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('neck')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('ring1')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('ring2')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('hand-left')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('chest')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('hand-right')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('gloves')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('pants')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('waist')");
	$mysqli -> query("INSERT INTO item_slots(name) VALUES ('boots')");

	$mysqli -> query("INSERT INTO item_models(name) VALUES ('Sword test')");
	$mysqli -> query("INSERT INTO item_models(name, image) VALUES ('Sword2 test', 2)");

	$mysqli -> query("INSERT INTO items(model, grade) VALUES (1, 1)");
	$mysqli -> query("INSERT INTO items(model, grade) VALUES (2, 1)");

	$mysqli -> query("INSERT INTO users(login, password) VALUES ('a', 'a')");

	$mysqli -> query("INSERT INTO characters(name) VALUES ('Azamantes')");
	$mysqli -> query("INSERT INTO users_characters(`user`, `character`) VALUES (1, 1)");

	$mysqli -> query("INSERT INTO inventory_types(name) VALUES ('inventory')");
	$mysqli -> query("INSERT INTO inventory_types(name) VALUES ('equipment')");
	$mysqli -> query("INSERT INTO equipment_slots(name) VALUES ('helm')");
	$mysqli -> query("INSERT INTO characters_items(`character`, `type`, `item`, `slot`) VALUES (1, 1, 1, 1)");
	$mysqli -> query("INSERT INTO characters_items(`character`, `type`, `item`, `slot`) VALUES (1, 1, 2, 2)");
	
	$mysqli -> query("INSERT INTO locations(`name`) VALUES ('Wioska')");
	$mysqli -> query("INSERT INTO locations_characters(`location`, `character`) VALUES (1, 1)");

	$mysqli -> close();

?>