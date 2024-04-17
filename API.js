//Modulo para crear, leer, actualizar y borrar los registros de las encuestas, usando como DB nedb
const { Router } = require('express')
const path = require('path')
const rt = Router()


//Cargar db's
const Datastore = require('nedb-promises')
//Creación de colecciones
let allDB = Datastore.create(path.join(__dirname, 'DB', 'all.db'))
//Cargar colecciones de la DB
async function loadDB() {
    try {
        await allDB.load()
        console.log('DBs cool');
    } catch (error) {
        console.log('Error al cargar las bases de datos');
    }
}

//Rutas de registro
rt.post('/cAll', async (req, res) => {
    try {
        const answer = req.body.answer
        const date = new Date()
        await allDB.insert({ answer, date })
        res.json({ msg: 200 })
    } catch (error) {
        res.json({ err: 500 })
    }

})

//Ruta para ver los datos
rt.get('/rAll', async (req, res) => {
    const data = await allDB.find({})
    res.json(data)
})

//Ruta par enviar las preguntas al frontend
rt.get('/qAll', (req, res) => {
    res.json(require(path.join(__dirname, 'questions', 'qAll.json')))
})


//Ruta para borrar un registro
rt.post("/delete", async (req, res) => {
    try {
        let code = parseInt(req.body.code)
        if (code == 3210) {
            let ID = req.body.ID
            await allDB.deleteOne({ _id: ID, })
            res.json({ msg: 200 })
        }else{
            res.json({msg: "Sin autorización para borrar"})
        }
    } catch (error) {
        res.json(error)
    }
})



//Ejecutar carga de colecciones
loadDB()
module.exports = rt
