var should = require('should'),
    async = require('async');

var config = require('../config/whisper.json');

var Whisper = require('../index')
var whisper = new Whisper(config);
var key;

var mySecret = 'this is a secret';

// by default these are the rate limits for a developer token
var rateLimit = {
    "*": {
        "limitCount": 10
    },
    "404": {
        "limitCount": 3
    },
    "201": {
        "limitCount": 3
    },
    "limitInterval": 10000
};



describe('Check all error codes', function () {
    
    it('Request the SDK without a token - confirm 401', function(done) {
        var badWhisper = new Whisper({'token': 'badtoken'});
        badWhisper.get('randomstring', (err, result) => {
            console.log(err);
            should.exist(err);
            err.statusCode.should.be.equal(401);
            done();
        });
    });

    it('Get an unknown whisper - confirm 404', function (done) {
        whisper.get('randomstring', (err, result) => {
            console.log(err);
            should.exist(err);
            err.statusCode.should.be.equal(404);
            done();
        });
    });

    it('Set a # of secrets that exceeds the threshold', function (done) {
        async.timesSeries(rateLimit['201'].limitCount + 1, (n, next) => {
            whisper.set(mySecret, (err, result) => {
                if (err) console.log(err);
                if (n < rateLimit['201'].limitCount) {
                    console.log(n + ': no error');
                    should.not.exist(err);
                }
                else {
                    console.log(n + ': error');
                    should.exist(err);
                }
                return next();
            })
        }, (err, results) => {
            console.log('done');
            done();
        });
    });

    it('Wait a period of time and then send again', function (done) {
        setTimeout(() => {
            whisper.set(mySecret, (err, result) => {
                if (err) console.log(err);
                should.not.exist(err);
                done();
            });
        }, rateLimit.limitInterval + 5000);
    });
    
        
    it('Get a whisper url twice - confirm expired 410', function (done) {
        // set the whisper
        whisper.set(mySecret, (err, result) => {
            if (err) console.log(err);
            should.not.exist(err);
            
            // get the whisper - should be fine
            whisper.get(result.key, (err, getResult1) => {
                if (err) console.log(err);
                should.not.exist(err);
                getResult1.secret.should.equal(mySecret);
                
                // get the whisper - should be expired
                whisper.get(result.key, (err, getResult2) => {
                    if (err) console.log(err);
                    should.exist(err);
                    err.statusCode.should.be.equal(410);
                    should.not.exist(getResult2);
                    done();
                });
            })
        });        
    });
});