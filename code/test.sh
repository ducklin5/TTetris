#!/bin/sh
(cd server && npm install) & (cd client && npm install)
(cd server && npm run test) & (cd client && npm run test)