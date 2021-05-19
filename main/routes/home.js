"use strict";
import express from 'express';
var router = express.Router();

router.get('/home', function(req, res, next) {
  res.render('home');
});

export { router };