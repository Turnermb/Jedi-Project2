# Minotaur

- **Author:** Matthew Turner
- **Link to Live Site:** https://minotaur-financial.herokuapp.com/

## Project Summary

Minotaur is a simple application that allows users to both create an account and save reminders of their positions (stocks purchased) using both mongodb and ejs.

As it mentions on the mission section of the webpage, Minotaur was named after the legendary creature from greek mythology combining the head of a bull with the body of a human. Which is meant in this case to represent the point where humankind meets today's bull market and for lack of a better phrase, grab the bull by the horns.

## Technology Used

Mongoose
Express
Auth login/signup

## Models

// Stock Schema
const Stock = new Schema({
name: { type: String, required: true },
ticker: { type: String, required: true },
price: { type: String, required: true },
stockQty: { type: Number, required: true },
});
// User Schema
const UserSchema = new Schema(
{
username: { type: String, unique: true, required: true },
password: { type: String, required: true },
stocks: [Stock],
},
{ timestamps: true }
);

## Route Map

| Method   | Endpoint           | Resource/View                                                                                                                                                                   |
| -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET      | "/"                | Landing page, displays login and sign up buttons and reasons why users should sign up. (home.ejs)                                                                               |
| GET/POST | "/auth/login"      | Allows the user to log in to their account and redirects to the index page. (auth/login.ejs)                                                                                    |
| GET/POST | "/auth/signup"     | Allows the user to create a Minotaur account and redirects to the login page. (auth/signup.ejs)                                                                                 |
| GET      | "/auth/logout"     | Allows the user to log out and redirects to the home page.                                                                                                                      |
| GET      | "/stocks/          | Checks to see if the user is logged in before showing the index page specific to their account. Shows listed positions and gives the option to create new entries. (stocks.ejs) |
| GET      | "/stocks/new"      | Checks to see if the user is logged in before showing the new page. (new.ejs)                                                                                                   |
| POST     | "/stocks"          | Create route. Takes information from the new page and updates the index page to reflect those additions.                                                                        |
| GET      | "/stocks/:id"      | Checks to see if the user is logged in before showing the show page for a specific entry. Also contains the edit/delete buttons.                                                |
| GET      | "/stocks/:id/edit" | Shows the edit page for a specific entry. Auto-populates fields with existing information. (edit.ejs)                                                                           |
| PUT      | "/stocks/:id"      | Takes changes made to the edit page and saves them to the body of the document so that they can be displayed.                                                                   |
| DELETE   | "/stocks/:id"      | Deletes a specific entry and redirects to the show page.                                                                                                                        |

## Challenges

The edit route/view gave me no end to trouble. I got a "Cannot read .\_id of undefined." error for a couple of days before it finally started working. As it turns out, it wasn't liking the way that I was defining stock in my route, so it wasn't reading it in my view. Once the code was re-worked a little bit it worked fine.

The biggest challenge with this project though in my opinion was just trying to find enough things to talk about to have a reasonably filled page. Outside of the home page I left a fair bit of empty space because I just couldn't figure out what to put there.

## Existing Bugs

Responsiveness is a bit of a mess. Dealing with a bug where the body only covers about half of the screen on anything other than the size of my laptop screen which makes it hard to style those elements.
