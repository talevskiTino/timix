const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} = require('./middleware/auth.ts');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers/index.js');
const User = require('./data/models/User.js');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cookieParser());

require('dotenv').config({ path: 'server/.env' });
require('dotenv').config();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['set-cookie'],
};
app.use(cors(corsOptions));

// define route to refresh token
app.post('/refresh_token', async (req, res) => {
  const refreshToken = req.cookies.jid;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ ok: false, message: 'No refresh token provided' });
  }
  try {
    // verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // find user in database based on decoded refresh token
    const user = await User.findOne({ _id: decoded.user_id });

    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: 'Invalid refresh token' });
    }

    // Set refresh token in a cookie
    sendRefreshToken(res, createRefreshToken(user));
    return res.status(200).json({
      ok: true,
      accessToken: createAccessToken(user),
      userId: decoded.user_id,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ ok: false, message: 'Invalid refresh token' });
  }
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
  }),
  // exclude refresh_token route from GraphQL server middleware
  plugins: [
    {
      requestDidStart() {
        return {
          didResolveOperation({ request, document }) {
            // ...
          },
        };
      },
    },
  ],
});

async function startServer() {
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: '/',
    cors: false,
  });

  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => {
      console.log('MongoDB Connected');
      server.listen({ port: process.env.PORT || 5000 }, () => {
        console.log(
          `Server running at http://localhost:${process.env.PORT || 5000}`
        );
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

startServer();
