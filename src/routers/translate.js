/**
 * Created with WebStorm 10.0
 * User：苏国均
 * Version：1.0.0
 * Date：16/8/4
 * Time：
 * Description：
 */

var router = require('express').Router();
var AV = require('leanengine');
var http = require('http');
var Utils = require('../utils/Utils');
var request = require('request');
var iconv = require('iconv-lite');
var urlencode = require('urlencode2');

var TranslateRecord = AV.Object.extend('TranslateRecord');


router.post('/addTranslateRecord', function (req, res, next) {
    var word = req.body.word;
    var translate = req.body.translate;
    console.log("addTranslateRecord->word:" + word + "<>translate:" + translate);
    if (!word || !translate) {
        res.send({code: 0, info: 'params error!!'});
        return;
    }
    var translateRecord = new TranslateRecord();
    translateRecord.set('word', word.toString());
    translateRecord.set('translate', translate.toString());
    translateRecord.save().then(function (translateRecord) {
        res.send({code: 1, info: translateRecord});
    }, function (error) {
        console.log("error->" + error);
        res.send({code: 0, info: error});
    });
});


router.get('/TranslateRecord', function (req, res, next) {
    var query = new AV.Query(TranslateRecord);
    query.find().then(function (translateRecord) {
        res.send({code: 1, info: translateRecord});
    }, function (error) {
        console.log("error->" + error);
        res.send({code: 0, info: error});
    });
});


router.get('/doTranslate', function (req, res, next) {
    var translateContent = req.query.content;
    //console.log("doTranslate start...");
    //console.log("translateContent-->" + translateContent);
    var url = Utils.YOUDAO_URL + urlencode(translateContent);

    //var url = Utils.YOUDAO_URL + iconv.decode(translateContent,'utf-8');
    //console.log("url-->" + url);

    var options = {
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': 'request',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            console.log(result);
            //console.log();
            saveTranslate(result.translation[0]);
            res.send({code: 1, info: result});
        } else {
            res.send({code: 0, info: error});
        }
    });


    function saveTranslate(translate) {
        var translateRecord = new TranslateRecord();
        translateRecord.set('word', translateContent);
        translateRecord.set('translate', translate);
        translateRecord.save()
    }
});


module.exports = router;