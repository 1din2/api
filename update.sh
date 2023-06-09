#!/bin/bash

#update repository
git pull
yarn
yarn build
pm2 restart ./pm2.json
