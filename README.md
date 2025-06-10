# Trailerflix
## Segunda Pre-entrega 
### Grupo 13 - Ingenias

#### Integrantes
* Sofia D'Ascanio
* Yanina Anahí Mylek
* María de los Ángeles Rechach

#### Para Iniciar Servidor

* ` cd pre-entrega-2 `
* ` npm start `

#### Dependencias

* ` npm install dotenv` 
* ` npm install mongodb` 


-----

| PETICIÓN | URL | DESCRIPCIÓN |
|:--------:|-----|-------------|
| GET | [/supermercado](/supermercado) | Obtener todos los productos |
| GET | [/supermercado/:codigo](/supermercado) | Obtener un producto especifico |
| GET | [/supermercado/nombre/:nombre](/supermercado) | Obtener todos los productos que coincidan con *nombre*|
| GET | [/supermercado/precio/:precio](/supermercado) | Obtener todos los productos que tengan un precio mayor o igual a *precio*|
| GET | [/supermercado/precio/:categoria](/supermercado) | Obtener todos los productos que coincidan con *categoria*|
| POST | [/supermercado](/supermercado) | Agregar un nuevos producto |
| PUT | [/supermercado/:codigo](/supermercado) | Modificar un producto existente |
| DELETE | [/supermercado/:codigo](/supermercado) | Eliminar un producto existente |


------
### ` GET /supermercado ` 

Para listar todos los productos del supermercado

### ` GET /supermercado/:codigo `

Para obtener un producto especifico, indicando el numero de código
``` 
GET /supermercado/5678
```

### ` GET /supermercado/nombre/:nombre ` 
Para obtener todos los productos donde el nombre coincida total o parcialmente con ***:nombre***
``` 
GET /supermercado/nombre/queso 
```

### ` GET /supermercado/precio/:precio `
Para obtener todos los productos donde precio sea mayor o igual a ***:precio***
``` 
GET /supermercado/precio/3 
``` 

### ` GET /supermercado/categoria/:categoria `
Para obtener todos los productos donde la categoria coincida total o parcialmente con ***:categoria***
``` 
GET /supermercado/categoria/limpieza
```

### ` POST /supermercado `

Para agregar un producto nuevo al supermercado. Los campos son: ***codigo***, ***nombre***, ***categoria*** y ***precio***.
``` javascript
	{
		nombre: "Chocolate",
		categoria: "Comestible",
		precio: 120
	}

```

### ` PUT /supermercado/:codigo `

Para modificar los valores de un producto existente. Se puede modificar un campo, o varios.

Solo se pueden modificar los campos: ***nombre***, ***categoria*** y ***precio***. 
* ***nombre*** y ***categoria*** deben ser un string valido
* ***precio*** debe ser un numero mayor o igual a 0
``` javascript
	{
		nombre: "Azucar",
		categoria: "Comestible",
		precio: 40
	}

```

### ` DELETE /supermercado/:codigo `

Para eliminar un producto del supermercado, se indica el numero de código
``` 
DELETE /supermercado/5678
```