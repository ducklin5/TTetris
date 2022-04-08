#!/bin/sh
(cd server && npm install) & (cd client && npm install)
(cd server && npm run start) & (cd client && npm run start)