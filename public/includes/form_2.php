<?php	
	if(empty($_POST['name2']) && strlen($_POST['name2']) == 0 || empty($_POST['input_256']) && strlen($_POST['input_256']) == 0 || empty($_POST['input_217']) && strlen($_POST['input_217']) == 0 || empty($_POST['input_417']) && strlen($_POST['input_417']) == 0 || empty($_POST['email2']) && strlen($_POST['email2']) == 0)
	{
		return false;
	}
	
	$name2 = $_POST['name2'];
	$input_256 = $_POST['input_256'];
	$input_217 = $_POST['input_217'];
	$input_417 = $_POST['input_417'];
	$email2 = $_POST['email2'];
	
	$to = 'receiver@yoursite.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\n".
				  "Name2: $name2 \nInput_256: $input_256 \nInput_217: $input_217 \nInput_417: $input_417 \nEmail2: $email2 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\n";
	$headers .= "Reply-To: $email2";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>