<?php
	// This script accepts an ID and looks in the user's session for stored thumbnail data.
	// It then streams the data to the browser as an image
	
	// Work around the Flash Player Cookie Bug
	if (isset($_POST["PHPSESSID"])) {
		session_id($_POST["PHPSESSID"]);
	}
	
	session_start();
	
	$image_id = isset($_GET["id"]) ? $_GET["id"] : false;

	if ($image_id === false) {
		header("HTTP/1.1 500 Internal Server Error");
		echo "No ID";
		exit(0);
	}

	if (!isset($_SESSION["file_info"][$image_id]) || !is_array($_SESSION["file_info"])) {
		//header("HTTP/1.1 404 Not found sdf");
		echo 'Not found <b>$file_info</b>';
		exit(0);
	}

	header("Content-type: image/jpeg") ;
	header("Content-Length: ".strlen($_SESSION["file_info"][$image_id]));
	echo $_SESSION["file_info"][$image_id];
	exit(0);
?>