//Programa de arranque del servidor
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000;

//Settings
app.set('view engine', 'ejs')

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Importar modulos de API.js y render.js
//Implementación del modulo
app.use('/api', require(path.join(__dirname, 'API.js')))
app.use(require(path.join(__dirname, 'render.js')))

//Permitir acceso a carpeta public
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => {
    console.log(`Server on port ${port}`);
})