<?php
class User
{
	public $userName;
	public $password;
	public $firstName;
	public $lastName;

	public function __construct($userName, $password, $firstName, $lastName)
	{
		$this->userName = $userName;
		$this->password = password_hash($password, PASSWORD_DEFAULT);
		$this->firstName = $firstName;
		$this->lastName = $lastName;
	}

	public function getUserName()
	{
		return $this->userName;
	}

	public function getFullName()
	{
		return $this->userName . " " . $this->lastName;
	}
}
