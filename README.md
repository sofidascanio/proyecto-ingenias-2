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
| GET | [/supermercado/:id](/supermercado) | Obtener un producto especifico |
| GET | [/supermercado/nombre](/supermercado) | Obtener todos los productos que coincidan con *nombre*|
| GET | [/supermercado/categoria](/supermercado) | Obtener todos los productos que coincidan con *categoria*|
| POST | [/supermercado](/supermercado) | Agregar un nuevos producto |
| PUT | [/supermercado/:id](/supermercado) | Modificar un producto existente |
| DELETE | [/supermercado/:id](/supermercado) | Eliminar un producto existente |


----

### Metodo ` PUT `
Para modificar los valores de un producto existente. Se puede modificar un campo, o varios.

Solo se pueden modificar los campos: ***nombre***, ***categoria*** y ***precio***. 
* ***nombre*** y ***categoria*** deben ser un string valido
* ***precio*** debe ser un numero mayor o igual a 0
``` javascript
	{
		nombre: "Chocolate",
		categoria: "Comestible",
		precio: 40
	}

```