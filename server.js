// Importeer de vereiste modules
import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import * as path from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import fetch from "node-fetch";

// Activeer het .env-bestand
dotenv.config();

// Maak een Express-app en een HTTP-server
const app = express();
const server = createServer(app);

// Koppel Socket.io aan de HTTP-server
const io = new Server(server);

// Serveer client-side bestanden
app.use(express.static("public"));
app.set("views", "./views");

// Maakt een route voor de index
app.get("/", (request, response) => {
    const defaultUrl = "https://zoeken.oba.nl/api/v1/search/?q=special:all%20boeken&refine=true&output=json";
    fetchJson(defaultUrl)
        .then((data) => {
            response.render("index", data);
        })
        .catch((error) => {
            response.render("error", { error: "Fout bij het ophalen van gegevens" });
        });
});

// Handelt de formulieren af
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Stel in hoe Express kan worden gebruikt
app.set("view engine", "ejs");
app.set("views", "./views");

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
app.get("/", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
	});
});

// Maakt een route voor de detailpagina
app.get("/item", async (request, response) => {
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
app.get("/reserveren", async (request, response) => {
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
app.post("/reserveren", (request, response) => {
	const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	postJson(url, request.body).then((data) => {
		let newReservering = { ... request.body }
		console.log(newReservering);
		if (data.id) {
			response.redirect('/succes') 
			console.log("werkt!")
	
		} else{
			response.redirect('/succes')
		}

	});
});

// Maakt een route voor de studieplek reserveringspagina
app.get(
	"/reserveer-een-studieplek",
	(request, response) => {
		const baseurl = "https://api.oba.fdnd.nl/api/v1";
		const url = `${baseurl}/studieplekReserveringen`;

		fetchJson(url).then((data) => {
			response.render("reserveer-een-studieplek", data);
		});
	}
);

app.get("/succes", (request, response) => {
		response.render("succes");
});

// Maakt een route voor de studieplek reserveringspagina om vestiging foto's in te laden
app.get(
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
app.post(
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
app.get("/activiteiten", (request, response) => {
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
app.get("/cursussen", (request, response) => {
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
app.get(
	"/vestigingen",
	(request, response) => {
		const baseurl = "https://api.oba.fdnd.nl/api/v1";
		const url = `${baseurl}/vestigingen`;

		fetchJson(url).then((data) => {
			response.render("vestigingen", data);
		});
	}
);

app.get("/draw", (request, response) => {
    fetchJson(defaultUrl).then((data) => {
		response.render("draw", data);
	});
});

// Start de server en luister naar inkomende verzoeken
const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server is gestart op http://localhost:${port}`);
});

// Realtime tekenen met Socket.io
io.on("connection", (socket) => {
  console.log("Een nieuwe gebruiker is verbonden");

  socket.on("drawing", (data) => {
    // Stuur de tekening naar alle verbonden clients, behalve de afzender
    socket.broadcast.emit("drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("Een gebruiker is losgekoppeld");
  });
});

// Realtime tekenen met Socket.io
io.on("connection", (socket) => {
    console.log("Een nieuwe gebruiker is verbonden");
  
    socket.on("drawing", (data) => {
      // Stuur de tekening naar alle verbonden clients, behalve de afzender
      socket.broadcast.emit("drawing", data);
    });
  
    socket.on("disconnect", () => {
      console.log("Een gebruiker is losgekoppeld");
    });
  });

// Hulpmethode voor het maken van een GET-verzoek en het parsen van het antwoord als JSON
async function fetchJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Hulpmethode voor het maken van een POST-verzoek met JSON-gegevens
async function postJson(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    return responseData;
}