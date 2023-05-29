// Importeert basis modules uit npm
import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

// Activeert het .env bestand
dotenv.config();

import * as path from 'path'
import {
	Server
} from 'socket.io'
import {
	createServer,
	request
} from 'http'
import fetch from "node-fetch";

// Maakt een nieuwe express app
const server = express();
const http = createServer(server)
const io = new Server(http)

// Stelt het poortnummer in waar express op gaat luisteren
const port = process.env.PORT || 3000

// Serveer client-side bestanden
server.use(express.static("public"));
server.set("views", "./views")

// Maakt een route voor de index
server.get("/", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
	});
});

// Handelt de formulieren af
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(bodyParser.json());

// Stel in hoe express gebruikt kan worden
server.set("view engine", "ejs");
server.set("views", "./views");

// Start express op, haal het ingestelde poortnummer op
server.listen(port, function () {
	// Toon een bericht in de console en geef het poortnummer door
	console.log(
		`Application started on http://localhost:` + port
	);
});

// Extenties voor de URL
const space = "%20";
const bookItems = "boeken";

// Endpoints voor de URL
const urlSearch = "search/";

// Opbouw URL van de API
const urlBase = "https://zoeken.oba.nl/api/v1/";
const urlQuery = "?q=";
const urlDefault = "special:all";
const urlKey = `${process.env.KEY}`;
const urlOutput = "&refine=true&output=json";

// opbouw url activiteiten en Cursus
const activityURL =
	urlBase +
	"/search/?q=special:all%20table:activiteiten&authorization=" +
	process.env.authorization +
	"&output=json";
const courseURL =
	urlBase +
	"/search/?q=special:all%20table:jsonsrc&authorization=" +
	process.env.authorization +
	"&output=json";

const defaultUrl =
	urlBase +
	urlSearch +
	urlQuery +
	urlDefault +
	space +
	bookItems +
	urlKey +
	urlOutput;

// Maakt een route voor de index
server.get("/", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
	});
});


// Maakt route voor loading

server.get("/loading", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("loading", data);
	});
});


// Maakt route voor Blank-initial-state

server.get("/blank-initial-state", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("blank-initial-state", data);
	});
});
// Maakt een route voor de detailpagina
server.get("/item", async (request, response) => {
	let uniqueQuery = "?id=";
	let urlId = request.query.id || "";

	const itemUrl =
		urlBase +
		urlSearch +
		uniqueQuery +
		urlId +
		urlKey +
		urlOutput;

	const data = await fetch(itemUrl)
		.then((response) => response.json())
		.catch((err) => err);
	response.render("item", data);
});

// Maakt een route voor de reguliere reserveringspagina
server.get("/reserveren", async (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	let uniqueQuery = "?id=";
	let urlId = request.query.id || "|oba-catalogus|279240";

	const itemUrl =
		urlBase +
		urlSearch +
		uniqueQuery +
		urlId +
		urlKey +
		urlOutput;

	const data = await fetch(itemUrl)
		.then((response) => response.json())
		.catch((err) => err);
	response.render("reserveren", data);

	fetchJson(url).then((data) => {
		response.render("reserveren", data);
	});
});

// Verstuurt de data naar de API
server.post("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	postJson(url, request.body).then((data) => {
		let newReservering = {
			...request.body
		}
		console.log(newReservering);
		if (data.id) {
			response.redirect('/succes')
			console.log("werkt!")

		} else {
			response.redirect('/succes')
		}

	});
});

// Maakt een route voor de studieplek reserveringspagina
server.get(
	"/reserveer-een-studieplek",
	(request, response) => {
		const baseurl = "https://api.oba.fdnd.nl/api/v1";
		const url = `${baseurl}/studieplekReserveringen`;

		fetchJson(url).then((data) => {
			response.render("reserveer-een-studieplek", data);
		});
	}
);

server.get("/succes", (request, response) => {
	response.render("succes");
});

// Maakt een route voor de studieplek reserveringspagina om vestiging foto's in te laden
server.get(
	"/reserveer-een-studieplek",
	(request, response) => {
		const baseurl = "https://api.oba.fdnd.nl/api/v1";
		const url = `${baseurl}/vestigingen?clgnoumd6fttt0buw6rwa00pa`;

		fetchJson(url).then((data) => {
			response.render("reserveer-een-studieplek", data);
		});
	}
);

// Verstuurt de data van de studieplek naar de API
server.post(
	"/reserveer-een-studieplek",
	(request, response) => {
		const baseurl = "https://api.oba.fdnd.nl/api/v1";
		const url = `${baseurl}/studieplekReserveringen`;

		postJson(url, request.body).then((data) => {
			let newReservation = {
				...request.body,
			};

			console.log(data);

			if (data.success) {
				response.redirect("/");
			} else {
				const errormessage = `${data.message}: Mogelijk komt dit door het id die al bestaat.`;
				const newdata = {
					error: errormessage,
					values: newReservation,
				};

				response.render(
					"reserveer-een-studieplek",
					newdata
				);
			}

			console.log(JSON.stringify(data.errors));
		});
	}
);

//Maakt een route voor de activiteiten pagina
server.get("/activiteiten", (request, response) => {
	fetchJson(activityURL).then((data) => {
		let dataClone = structuredClone(data);

		if (request.query.titles) {
			dataClone.results.titles =
				dataClone.results.titles.filter(function (title) {
					return results.titles.includes(
						request.query.titles
					);
				});
		}

		response.render("activiteiten", dataClone);
	});
});

// Maakt route voor de cursussen pagina
server.get("/cursussen", (request, response) => {
	fetchJson(courseURL).then((data) => {
		let dataClone = structuredClone(data);

		if (request.query.titles) {
			dataClone.results.titles =
				dataClone.results.titles.filter(function (title) {
					return results.titles.includes(
						request.query.titles
					);
				});
		}
		response.render("cursussen", dataClone);
	});
});

//Maakt route voor de Vestigingen pagina
server.get(
	"/vestigingen",
	(request, response) => {
		const baseurl = "https://api.oba.fdnd.nl/api/v1";
		const url = `${baseurl}/vestigingen`;

		fetchJson(url).then((data) => {
			response.render("vestigingen", data);
		});
	}
);

server.get("/draw", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("draw", data);
	});
});

// Regelt het realtime tekenen

// Socket.IO verbinding
io.on('connection', (socket) => {
	console.log('Een gebruiker heeft verbinding gemaakt');

	// Luister naar tekengebeurtenis
	socket.on('teken', (data) => {
		// Stuur het tekengegevens naar alle verbonden clients
		io.emit('teken', data);
	});

	// Afhandelen van ontkoppeling
	socket.on('disconnect', () => {
		console.log('Een gebruiker heeft de verbinding verbroken');
	});
});

/**
 * fetchJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter and returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
export async function fetchJson(url, payload = {}) {
	return await fetch(url, payload)
		.then((response) => response.json())
		.catch((error) => error);
}

export async function postJson(url, body) {
	return await fetch(url, {
			method: "post",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((response) => response.json())
		.catch((error) => error);
}