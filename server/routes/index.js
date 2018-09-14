/**
 * Created by jlmconsulting on 26/05/2017.
 */
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
const mongo = require('mongodb');
const objectId = require('mongodb').ObjectID;
const crypto = require('crypto');
const async = require('async');
const fs = require('fs');
const path = require('path');
const uid = require('rand-token').uid;
const token = uid(16);
const os = require('os');
//Twin Connection URL
var url = "";

if (os.hostname().indexOf("local") > -1)
    url = "mongodb://localhost:27017/angularlog";
else
    url = 'mongodb://jmullings.calata:Winter1972@ds261429.mlab.com:61429/angularlog';

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    console.log("Connected correctly to server");
    db.close();
});


router.post('/api/v1/account/getid', function (req, res, next) {
    const encrypted = req.body.encrypted;
  
    try {
        mongo.connect(url, function (err, database) {
            assert.equal(null, err);
            const angularlog = database.db('angularlog')
            angularlog.collection('user-data').findOne({"password": encrypted}, function (err, result) {
                if (result)
                    res.json(result)
                else
                    res.json(null)
            });
            database.close();
        });
    } catch (e) {
        console.log(e)
        res.json({
            err: e,
            token: null,
            encrypted: null
        });
    }
});

router.post('/api/v1/account/get-user', function (req, res, next) {
    const cipher = crypto.createCipher('aes192', req.body.password);
    let encrypted = cipher.update(req.body.email, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    try {
        mongo.connect(url, function (err, database) {
            assert.equal(null, err);
            const angularlog = database.db('angularlog')

            angularlog.collection('user-data').findOne({"password": encrypted}, function (err, result) {
                if (result)
                    res.json(result)
                else
                    res.json(null)
            });
            database.close();
        });

    } catch (e) {
        console.log(e)
        res.json({
            err: e,
            token: null,
            encrypted: null
        });
    }



});
//Image inseert via express uploader//
router.post('/api/v1/account/insert', function (req, res, next) {
    ///Collect all form data
    const cipher = crypto.createCipher('aes192', req.body.password);
    let encrypted = cipher.update(req.body.email, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    var item = {
        first: req.body.firstname,
        surname: req.body.lastname,
        email: req.body.email,
        password: encrypted,
        token: token
    };

    try {
        mongo.connect(url, function (err, database) {
            assert.equal(null, err);
            const angularlog = database.db('angularlog')
            angularlog.collection('user-data').insertOne(item, function (err, result) {
                assert.equal(null, err);
            });
            res.json({
                err: null,
                token: token,
                encrypted: encrypted
            });
            database.close();
        });
    } catch (e) {
        console.log(e)
        res.json({
            err: e,
            token: null,
            encrypted: null
        });
    }
});

module.exports = router;