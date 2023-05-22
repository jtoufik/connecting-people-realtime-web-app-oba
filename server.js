import { Server } from 'socket.io'
import { createServer, request } from 'http'
import express, { response } from 'express'
import socketAntiSpam from 'antispam'



const app = express()
const http = createServer(app)
const io = new Server(http)
const port = process.env.PORT || 9000

// Serveer client-side bestanden
app.use(express.static(path.resolve('public')))
app.set("views", "./views")

// Maakt een route voor de index
server.get("/", (request, response) => {
	fetchJson(defaultUrl).then((data) => {
		response.render("index", data);
	});
});