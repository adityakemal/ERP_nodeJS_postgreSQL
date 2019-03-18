<?php	
	if(empty($_POST['name3']) && strlen($_POST['name3']) == 0 || empty($_POST['email3']) && strlen($_POST['email3']) == 0 || empty($_POST['message']) && strlen($_POST['message']) == 0)
	{
		return false;
	}
	
	$name3 = $_POST['name3'];
	$email3 = $_POST['email3'];
	$message = $_POST['message'];
	
	$to = 'receiver@yoursite.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\n".
				  "Name3: $name3 \nEmail3: $email3 \nMessage: $message \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\n";
	$headers .= "Reply-To: $email3";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>