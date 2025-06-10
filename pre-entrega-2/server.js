const express = require('express');
const app = express();
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb');
const PORT = process.env.PORT || 3000;
const { ObjectId } = require('mongodb'); //Para poder hacer la busqueda por id

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

// GET /supermercado/:id
app.get('/supermercado/:id', async (req,res)=>{
    const productoId= parseInt(req.params.codigo)||0;

    const client = await connectToMongoDB();

    if(!client){
        return res.status(500).send('Error al conectarse a MongoDB');
    }

    const db = client.db('supermercado');

    const producto= await db.collection('supermercado').findOne({codigo:productoId});

    if(!producto){
        res.status(404).send(`El código ${productoId} no se encuentra cargado`);
    } else {
        res.json(producto)
    }
    await disconnectFromMongoDB();
});

// GET /supermercado/nombre/:nombre
app.get('/supermercado/nombre/:nombre', async (req,res)=>{
    const producto = req.params.nombre.trim().toLowerCase();

    const client = await connectToMongoDB();

    if(!client){
        return res.status(500).send('Error al conectarse a MongoDB');
    }

    const db = client.db('supermercado');

    const resultados = await db.collection('supermercado').find({ nombre: {$regex: producto, $options:'i'}}).toArray();

    if(resultados.length===0){
        res.status(404).send(`No se encontraron productos con el nombre ${producto}`);
    } else {
        res.json(resultados);
    }
    await disconnectFromMongoDB();
});

// GET /supermercado/precio/:precio
app.get('/supermercado/precio/:precio', async (req,res)=>{
    const precio = parseFloat(req.params.precio);

    if (isNaN(precio)){
        return res.status(400).send('El valor ingresado no es válido');
    }

    const client = await connectToMongoDB();

    if(!client){
        return res.status(500).send('Error al conectarse a MongoDB');
    }

    const db = client.db('supermercado');

    const resultados = await db.collection('supermercado').find({precio: {$gte: precio}}).toArray();

    if(resultados.length===0){
        res.status(404).send(`No se encontraron productos de S${precio} o mayor valor`);
    }else{
        res.json(resultados);
    }
    await disconnectFromMongoDB();
});

// GET /supermercado/categoria/:categoria
app.get('/supermercado/categoria/:categoria', async (req,res)=>{
    const categoriaP = req.params.categoria.trim().toLowerCase();

    const client = await connectToMongoDB();

    if(!client){
        return res.status(500).send('Error al conectarse a MongoDB');
    }

    const db = client.db('supermercado');

    const resultados = await db.collection('supermercado').find({categoria: {$regex: categoriaP, $options:'i'}}).toArray();

    if(resultados.length===0){
        res.status(404).send(`No se encontraron productos de la categoria ${categoriaP}`);
    } else {
        res.json(resultados);
    }

    await disconnectFromMongoDB();
});


// POST /supermercado
app.post('/supermercado', async (req, res) => {
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

});

// PUT /supermercado/:id
app.put('/supermercado/:id', async (req, res) => {
    const id = new ObjectId(req.params.id);

    if (!ObjectId.isValid(id)) {
        res.status(400).json( {error: 'ID inválido'} );
        return;
    }
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

    if (nuevosDatos.codigo && (typeof nuevosDatos.codigo === 'number' && nuevosDatos.codigo > 0)) {
        producto.codigo = nuevosDatos.codigo;
        log.codigo = `Se modifico el codigo del producto: ${producto.codigo}`;
    } else {
        log.codigo = "El valor de codigo tiene que ser un numero mayor a 0";
    }

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

    if ((nuevosDatos.precio || nuevosDatos.precio === 0) && (typeof nuevosDatos.precio === 'number' && nuevosDatos.precio >= 0)) {
        producto.precio = nuevosDatos.precio;
        log.precio = `Se modifico el precio del producto: ${producto.precio}`;
    } else {
        log.precio = "El valor de precio tiene que ser un numero mayor o igual a 0";
    }

    db.collection('supermercado').updateOne({ _id: parseInt(id) }, { $set: producto }).then((resultado) => {
        if (resultado.matchedCount === 0) {
            res.status(404).send(`No se encontro producto con el codigo proporcionado: ${id}`);
        } else {
            console.log('Producto modificado');
            res.status(200).send(log);
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).json( {descripcion: 'Error al modificar el producto' });
    }).finally(() => {
        disconnectFromMongoDB();
    });

}); 

// DELETE /supermercado/:id
app.delete('/supermercado/:id', async (req, res) => {
    const id = new ObjectId(req.params.id);
    //transformo id en un nuevo objetoId (para que Mongo me tome la petición)
    if (!ObjectId.isValid(id)) {
        res.status(400).json({error: 'ID inválido'});
        return;
    }

    const client = await connectToMongoDB();

    if (!client){
        res.status(500).json({error: 'Error al conectar con la base de datos'});
        return;
    }

    client.connect()
    .then(() => {
        const catalogo = client.db('supermercado').collection('supermercado');    
        return catalogo.deleteOne({ _id : id}); 
    })
    .then((resultado) => {
        if (resultado.deletedCount === 0) {
            res.status(404).json({error: 'No se ha encontrado el ID solcitado'});
        } else {
            console.log('Artículo eliminado')
            res.status(204).json();
        }
    })
    .catch(error => {
        console.error(error);
    })
    .finally(() => {
        disconnectFromMongoDB();
    });
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