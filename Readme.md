# Bitespeed Assessment

Copy the git URL and clone it in your local.
Please make sure you have node, and npm is installed in your local with running mySQL server

## Installation

use npm for installation

```bash
npm install
```
create a .env file for sql server
Add following
```bash
#sql server config
SQL_USER=root
SQL_PASSWORD=12345678
SQL_SERVER=localhost
SQL_ENCRYPT=false
```
Change it accordingly

start the server using 
```bash
npm start
```

to create request copy the below curl and change the body accordingly
```bash
curl --location 'localhost:3000/identity' \
--header 'Content-Type: application/json' \
--data '{
	
"email":"123@gmail.com",
"phoneNumber":"1234561"

}'
```