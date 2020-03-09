<?php
$retcode = 200;

// check that required data is present
// http 400 Bad Request
if (!isset($_GET["city"])) {
	echo "City Not Specified\n";
	$retcode = 400;
} else { 
	$city = $_GET["city"];

	$url = "http://dev.virtualearth.net/REST/v1/Locations?q=$city?output=json&key=Aib7G3dTUXZqBQs-KEy-OQpnnH1jSG_11i8Prwq0uK9HDbX_8ezHM9ked0zdYAHj";


	
	
	$curl = curl_init();

	curl_setopt_array($curl, array(
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL =>$url
	));
	
	$resp = curl_exec($curl);
								
	curl_close($curl);
	echo $resp;
}

http_response_code($retcode);



