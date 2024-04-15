//Modulo para cargar vistas al cliente con ejs
const { Router } = require('express')
const path = require('path')
const rt = Router()

rt.get('/', (req, res) => {
    res.render('main.ejs')
})

rt.get('/etica', (req, res) => {
    res.render('etica.ejs')
})

rt.get('/moral', (req, res) => {
    res.render('moral.ejs')
})

rt.get('/valores', (req, res) => {
    res.render('valores.ejs')
})

rt.get('/showData', (req, res) => {
    res.render('showData.ejs')
})
module.exports = rt