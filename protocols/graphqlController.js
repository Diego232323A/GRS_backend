const { gql } = require('apollo-server-express');
const connection = require('../protocols/Connection');

// Definir el esquema GraphQLView para equipos
const typeDefs = gql`
  type Team {
    id: ID!
    name: String!
    stadium: String
    coach: String
    yearFounded: Int
    logoUrl: String
  }

  type Query {
    teams: [Team]
    team(id: ID!): Team
  }

  type Mutation {
    addTeam(name: String!, stadium: String, coach: String, yearFounded: Int, logoUrl: String): Team
    updateTeam(id: ID!, name: String!, stadium: String, coach: String, yearFounded: Int, logoUrl: String): Team
    deleteTeam(id: ID!): Team
  }
`;

// Resolvers para consultas y mutaciones de equipos
const resolvers = {
    Query: {
        teams: async () => {
            return new Promise((resolve, reject) => {
                connection.query('SELECT * FROM teams', (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        },
        team: async (_, { id }) => {
            return new Promise((resolve, reject) => {
                connection.query('SELECT * FROM teams WHERE id = ?', [id], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results[0]);
                    }
                });
            });
        },
    },
    Mutation: {
        addTeam: async (_, { name, stadium, coach, yearFounded, logoUrl }) => {
            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO teams (name, stadium, coach, yearFounded, logoUrl) VALUES (?, ?, ?, ?, ?)',
                    [name, stadium, coach, yearFounded, logoUrl],
                    (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id: results.insertId, name, stadium, coach, yearFounded, logoUrl });
                        }
                    }
                );
            });
        },
        updateTeam: async (_, { id, name, stadium, coach, yearFounded, logoUrl }) => {
            return new Promise((resolve, reject) => {
                connection.query('UPDATE teams SET name = ?, stadium = ?, coach = ?, yearFounded = ?, logoUrl = ? WHERE id = ?',
                    [name, stadium, coach, yearFounded, logoUrl, id],
                    (err, results) => {
                        if (err) {
                            reject(err);
                        } else if (results.affectedRows === 0) {
                            reject(new Error('Team not found'));
                        } else {
                            resolve({ id, name, stadium, coach, yearFounded, logoUrl });
                        }
                    }
                );
            });
        },
        deleteTeam: async (_, { id }) => {
            return new Promise((resolve, reject) => {
                connection.query('DELETE FROM teams WHERE id = ?', [id], (err, results) => {
                    if (err) {
                        reject(err);
                    } else if (results.affectedRows === 0) {
                        reject(new Error('Team not found'));
                    } else {
                        resolve({ id });
                    }
                });
            });
        }
    }
};

module.exports = { typeDefs, resolvers };
