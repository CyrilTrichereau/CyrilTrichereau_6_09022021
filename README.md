# 🚀 Welcome to Piquante API REST#


**This API REST is part of the web developer training from OpenClassrooms**
**Project 6 : Build a secure API for a food review app**

***------------------***
***------------------***

### Installation ###

**1st:** Clone the repository at this URL : 
```
https://github.com/CyrilTrichereau/CyrilTrichereau_6_09022021
```

**2nd:** Install dependencies : from within the project folder, run `npm install`.

```
npm install
```

**3rd:** Then, add the .env file to the root repository of the project (only send to the mentor/evaluator).


**4th:** Now you can :

*Run the API with nodemon:*
```
nodemon server
```

***------------------***
***------------------***

### Tutorial ###

**Sauce**
The data model for a sauce is as follows :

***● id:*** [ObjectID] — unique identifier created by MongoDB ;
***● userId:*** [string] — unique identifier created by MongoDB for the user who created the
sauce ;
***● name:*** [string] — name of the sauce ;
***● manufacturer:*** [string] — sauce maker ;
***● description:*** [string] — description of the sauce ;
***● mainPepper:*** [string] — main ingredient in sauce ;
***● imageUrl:*** [string] — string of the sauce image uploaded by the user ;
***● heat:*** [number] — number between 1 and 10 describing the strength of the sauce ;
***● likes:*** [number] — number of users who like the sauce ;
***● dislikes:*** [number] — number of users who do not like the sauce ;
***● usersLiked:*** [string] — table of user IDs who liked the sauce ;
***● usersDisliked:*** [string] — table of user identifiers who did not like
the sauce ;

***------------------***

**User**
The data model for a user is as follows :

***● userId:*** [string] — MongoDB unique identifier for the user who created the
sauce ;
***● email:*** [string] — user's email address [unique] ;
***● password:*** [string] — user password hash.

***------------------***

**Routes**

***POST*** 
URI: `/api/auth/signup`
 { email:string, password:string }
{ message:string }
Encrypts user password, adds user to database.

***POST*** 
URI: `/api/auth/login` 
{ email:string, password:string }
{ userId:string, token:string }
Checks the user's credentials, returning the userID from the database and a signed JSON web token (also containing the userID).

***GET*** 
URI: `/api/sauces` 
- Tableau des sauces
Returns the array of all the sauces in the database.


***GET*** 
URI: `/api/sauces/:id`
- 
Unique sauce
Return the sauce with the ID provided.

***POST***
URI: `/api/sauces`
 { sauce :Chaîne, image :Fichier }
{ message: Chaîne }
Capture and save the image, analyze the sauce using a
character string and save it in the database, in defining correctly sound image URL. Put them back favorite sauces and those hated to 0, and the usersliked sauces and those usersdisliked to empty tables.

***PUT*** 
URI: `/api/sauces/:id` 
SOIT Sauce comme JSON OU { sauce :Chaîne, image :Fichier }
{ message: Chaîne }
Update the sauce with the identifier provided. Yes a picture is downloaded, capture it and update the image
Sauces URL. Yes no file is provided, the details of the
sauce figure directly in the request body (req.body.name, req.body.heat etc). Yes a file is provided, the sauce with chain is in req.body.sauce.

***DELETE***
URI: `/api/sauces/:id`
 - 
 { message: Chaîne }
Remove the sauce with the ID provided.

***POST*** 
URI: `/api/sauces/:id/like`
 { userId:Chaîne, j'aime :Nombre }
{ message: Chaîne }
Set the status "like" for userID provided. If I like = 1, the user likes it sauce. If like = 0, user cancels this what he likes or what he do not like. If I like = -1, the user does not like not the sauce. The identifier of user must be added or deleted from appropriate table, in keeping track of his preferences and in preventing him from loving or not to like the same sauce several time. Total number of "I like" and "I don't like not "to update with each "like".

***------------------***

*Have a question ?*
Do not hesitate to contact me !
