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

var TranslateRecord = AV.Object.extend('TranslateRecord');


router.post('/addTranslateRecord', function (req, res, next) {
    var word = req.params.word;
    var translate = req.params.translate;
    console.log("addTranslateRecord->word" + word + "<>translate:" + translate);
    if (!word || !translate) {
        res.send({code: 0, info: 'params error!!'});
        return;
    }
    var translateRecord = new TranslateRecord();
    translateRecord.set('word', word);
    translateRecord.set('translate', translate);
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


module.exports = router;