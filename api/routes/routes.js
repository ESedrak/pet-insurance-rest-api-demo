const express = require("express");
bodyParser = require("body-parser");

// create application/json parser - used for /post method only
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(bodyParser.json());

// routes is an instance of the express router
// We use it to define our API endpoints
// The router will be added as a middleware and will take control of routing requests to the correct endpoint
const routes = express.Router();

// This will help us connect to the database
const dbo = require("../db/db");

routes.route("/pets").get(async function (_req, res) {
	let pets = [];
	dbo
		.getDb()
		.collection("pets")
		.find()
		.sort({ risk: 1 })
		.forEach((pet) => pets.push(pet))
		.then(() => {
			res.status(200).json(pets);
		})
		.catch(() => {
			res.status(500).json({ error: "Something's wrong" });
		});
});

routes.route("/pets/dogs").get(async function (_req, res) {
	let dogs = [];
	dbo
		.getDb()
		.collection("pets")
		.find({ type: "dog" })
		.sort({ risk: 1 })
		.forEach((dog) => dogs.push(dog))
		.then(() => {
			res.status(200).json(dogs);
		})
		.catch(() => {
			res.status(500).json({ error: "Something's wrong" });
		});
});

// Health check endpoint
// Endpoint to call to ensure your API is up and healthy
// Can use a service to call this and report the health of your API using CI
routes.route("/health").get(async function (_req, res) {
	const data = {
		uptime: process.uptime(),
		message: "OK",
		date: new Date(),
	};

	res.status(200).send(data);
});

module.exports = routes;
