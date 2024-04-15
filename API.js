//Modulo para crear, leer, actualizar y borrar los registros de las encuestas, usando como DB nedb
const { Router } = require('express')
const path = require('path')
const rt = Router()


//Cargar db's
const Datastore = require('nedb-promises')
//Creación de colecciones
let valoresDB = Datastore.create(path.join(__dirname, 'DB', 'valores.db'))
let moralDB = Datastore.create(path.join(__dirname, 'DB', 'moral.db'))
let eticaDB = Datastore.create(path.join(__dirname, 'DB', 'etica.db'))

//Cargar colecciones de la DB
async function loadDB() {
    try {
        await valoresDB.load()
        await moralDB.load()
        await eticaDB.load()
        console.log('DBs cool');
    } catch (error) {
        console.log('Error al cargar las bases de datos');
    }
}
//Ruta para hacer registros en valoresDB
rt.post('/cValores', async (req, res) => {
    try {
        const answer = req.body.answer
        const date = new Date()
        await valoresDB.insert({ answer, date })
        res.json({ msg: 200 })
    } catch (error) {
        res.json({ err: 500 })
    }

})

//Ruta para hacer registros en moralDB
rt.post('/cMoral', async (req, res) => {
    try {
        const answer = req.body.answer
        const date = new Date()
        await moralDB.insert({ answer, date })
        res.json({ msg: 200 })
    } catch (error) {
        res.json({ err: 500 })
    }

})

//Ruta para hacer registros en eticaDB
rt.post('/cEtica', async (req, res) => {
    try {
        const answer = req.body.answer
        const date = new Date()
        await eticaDB.insert({ answer, date })
        res.json({ msg: 200 })
    } catch (error) {
        res.json({ err: 500 })
    }

})

//Ruta para ver los datos
rt.get('/rValores', async (req, res) => {
    const data = await valoresDB.find({})
    res.json(data)
})

rt.get('/rMoral', async (req, res) => {
    const data = await moralDB.find({})
    res.json(data)
})

rt.get('/rEtica', async (req, res) => {
    const data = await eticaDB.find({})
    res.json(data)
})


//Rutas para enviar las preguntas del formulario
rt.get('/qMoral', (req, res) => {
    res.json(require(path.join(__dirname, 'questions', 'qMoral.json')))
})

rt.get('/qEtica', (req, res) => {
    res.json(require(path.join(__dirname, 'questions', 'qEtica.json')))
})
rt.get('/qValores', (req, res) => {
    res.json(require(path.join(__dirname, 'questions', 'qValores.json')))
})




//Ejecutar carga de colecciones
loadDB()
module.exports = rt