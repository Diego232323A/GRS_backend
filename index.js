const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connection = require('./protocols/Connection'); // Importar la conexión a la base de datos
const restController = require('./protocols/restController');
const xmlController = require('./protocols/xmlController');
const { typeDefs, resolvers } = require('./protocols/graphqlController');

const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

// Middleware para manejar cuerpos de texto (XML)
app.use(express.text({ type: 'application/xml' }));

// Rutas RESTfulView
app.use('/api', restController);

// Rutas para manejo de XML
app.use('/xml', xmlController);

// Configurar Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Inicializar el servidor Apollo de manera asíncrona
const startServer = async () => {
    await server.start();
    server.applyMiddleware({ app });

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
        console.log(`RESTful endpoint: http://localhost:${port}/api`);
        console.log(`XML(SOAP) endpoint: http://localhost:${port}/xml`);
        console.log(`GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
    });
};

// Verificar la conexión a la base de datos y mostrar el mensaje correspondiente
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

// Iniciar el servidor Apollo
startServer();
