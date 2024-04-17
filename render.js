//Modulo para cargar vistas al cliente con ejs
const { Router } = require('express')
const path = require('path')
const rt = Router()

rt.get('/', (req, res) => {
    res.render('main.ejs')
})

rt.get('/formulario', (req, res) => {
    res.render('formulario.ejs')
})

rt.get('/showData', (req, res) => {
    res.render('showData.ejs')
})
module.exports = rt