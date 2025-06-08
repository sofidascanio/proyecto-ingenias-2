const express = require('express');
const app = express();
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb');
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});

// GET /
app.get('/', (req, res) => {
    res.status(200).end("Hola Mundo");
});

// GET /supermercado
app.get('/supermercado', async (req, res) => {
    // Listar todo

    const client = await connectToMongoDB();

    if (!client) {
        res.status(500).send("Error al conectarse a MongoDB");
        return;
    }

    const db = client.db('supermercado');

    const supermercado = await db.collection('supermercado').find().toArray();

    await disconnectFromMongoDB();

    if (supermercado.length === 0) {
        return res.json({ mensaje: 'No hay productos para mostrar' });
    };

    res.json(supermercado);
});

// Pide al menos dos GET para buscar datos
// Cada producto tiene: id, nombre, precio, categoria

// GET /supermercado/:id
app.get('/supermercado/:id', async (req, res) => {
    // Consulta por ID
});

// GET /supermercado/nombre/:nombre
app.get('/supermercado/nombre/:nombre', async (req, res) => {
    // Consulta por nombre
    // Busqueda parcial
});

// GET /supermercado/precio/:precio
app.get('/supermercado/precio/:precio', async (req, res) => {
    // Consulta por precio
});

// GET /supermercado/categoria/:categoria
app.get('/supermercado/categoria/:categoria', async (req, res) => {
    // opcional, pide dos GET para buscar datos
    // preguntar que onda las categorias, si son fijas o se pueden agregar otras random
});

// POST /supermercado
app.post('/supermercado', async (req, res) => {
    // Agregar nuevo producto
    const nuevoProducto = req.body;
    if(nuevoProducto===undefined){
        res.status(400).send('Error en el formato de datos a crear');
    }
    const client = await connectToMongoDB();
    if(!client){
        res.status(500).send('Error al conectarse con MongoDB');
    }
    const collection = client.db('supermercado').collection('supermercado');
    collection.insertOne(nuevoProducto)
    .then(()=>{
        console.log('Nuevo producto creado');
        res.status(201).send('Nuevo producto agregado correctamente');
    })
    .catch(error =>{
        console.error(error);
    })
    .finally(()=>{
        disconnectFromMongoDB();
    });

    
    
    // ID: ver como manejar, autoincremental no creo que sea
    // digito de 4 numeros, generar uno random¿? y chequear
    // Lo manejamos aca, no importa que se mande en el request
    
    // chequear que nombre sea un string valido, regex¿?
    // chequear que precio sea un numero mayor o igual a 0
    // chequear categoria, si hay algun listado o es un campo libre
});

// PUT /supermercado/:id
app.put('/supermercado/:id', async (req, res) => {
    const codigo = req.params.id;
    const nuevosDatos = req.body;

    if (!nuevosDatos) {
        res.status(400).send('Error en el formato de datos recibido');
        return;
    }

    const client = await connectToMongoDB();

    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB');
        return;
    }

    const db = client.db('supermercado');

    producto = { }
    log = { }
    // Si existen nombre y categoria en el request, los agrega a producto
    // Solo se guardan si son string
    // pregunto por separado porque puede no existir, chequear
    if (nuevosDatos.nombre) {
        if (typeof nuevosDatos.nombre === 'string') {
            producto.nombre = nuevosDatos.nombre;
            log.nombre = `Se modifico el nombre del producto: ${producto.nombre}`;
        }
        else {
            log.nombre = "El nombre del producto tiene que ser una cadena de caracteres valida";
        }
    }   
    if (nuevosDatos.categoria) {
        if (typeof nuevosDatos.categoria === 'string') {
            producto.categoria = nuevosDatos.categoria;
            log.categoria = `Se modifico la categoria del producto: ${producto.categoria}`;
        }
        else {
            log.categoria = "La categoria del producto tiene que ser una cadena de caracteres valida";
        }
    }   

    // Si existe un precio, es un numero, mayor o igual a 0, lo guarda
    // Si no pregunto explicitamente con el nuevosDatos.precio si es igual a 0, no entra
    if ((nuevosDatos.precio || nuevosDatos.precio === 0) && (typeof nuevosDatos.precio === 'number' && nuevosDatos.precio >= 0)) {
        producto.precio = nuevosDatos.precio;
        log.precio = `Se modifico el precio del producto: ${producto.precio}`;
    } else {
        log.precio = "El valor de precio tiene que ser un numero mayor o igual a 0";
    }

    db.collection('supermercado').updateOne({ codigo: parseInt(codigo) }, { $set: producto }).then(() => {
        console.log('Producto modificado');
        res.status(200).send(log);
    }).catch((error) => {
        console.log(error);
        res.status(500).json( {descripcion: 'Error al modificar el producto' });
    }).finally(() => {
        disconnectFromMongoDB();
    });
}); 

// DELETE /supermercado/:id
app.delete('/supermercado/:id', async (req, res) => {
    // Borrar producto
}); 

// Manejo de rutas invalidas
app.use((req, res) => {
    res.status(404).send({
      error: "404",
      descripcion: "No se encuentra la ruta o recurso solicitado."
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});