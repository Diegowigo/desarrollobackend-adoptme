# API de Adoptme

Este proyecto es una API desarrollada con Node.js, Express y MongoDB. Permite la gestión de adopción de mascotas con usuarios.

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB con Mongoose**
- **Docker**
- **Swagger**

## Instalación y configuración

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Diegowigo/desarrollobackend-adoptme
   cd desarrollobackend-adoptme
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor:
   ```bash
   npm start
   ```
   La API estará disponible en `http://localhost:8080`.

## Endpoints principales

### Pets

- `GET /api/pets` - Obtener todas las mascotas.
- `POST /api/pets` - Agregar una nueva mascota.
- `POST /api/pets/withimage` - Agregar una mascota con imagen.
- `PUT /api/pets/:pid` - Actualizar una mascota por ID.
- `DELETE /api/pets/:pid` - Eliminar una mascota por ID.

### Users

- `GET /api/users` - Obtener todos los usuarios.
- `GET /api/users/:uid` - Obtener un usuario por ID.
- `PUT /api/users/:uid` - Actualizar un usuario por ID.
- `DELETE /api/users/:uid` - Eliminar un usuario por ID.
- `POST /api/users` - Agregar un nuevo usuario.

## Contribución

Si deseas contribuir, puedes abrir un issue o hacer un pull request.
