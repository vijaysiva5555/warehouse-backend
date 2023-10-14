#!/bin/bash

sudo pm2 kill backendApp
sudo pm2 start app.js --name backendApp
sudo pm2 save