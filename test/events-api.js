var should = require('chai').should();
var supertest = require('supertest');
var path = require('path');
var app = require(path.join(__dirname, '..', 'app'));
var client = supertest(app);

var FieldNames = {
    details: ['name', 'category', 'subCategory','organization','coordinators','description',
            'teamSize','participationFee'],
    list:  ['name', 'category', 'subCategory','organization','teamSize',
            'participationFee']
};

/*
- /api/events/name?q=
- /api/events/organization?q=
- /api/events/category?q=
- /api/events/subCategory?q=
*/

describe('Test Events API Endpoints', function(){
    
    it('GET /api/events/list', function (done) {
        client.get('/api/events/list')
        .expect(200)
        .end(function (err, res) {
            should.not.exist(err);
            res.body.should.have.property('events');

            res.body.events.forEach(function(event) {
                FieldNames.list.forEach(function (field) {
                    event.should.have.property(field);
                });
            });

            done();
        });
    });


    it('GET /api/events/name?q=' + encodeURIComponent('league'), function (done) {
        client.get('/api/events/name?q=' + encodeURIComponent('league'))
        .expect(200)
        .end(function (err, res) {
            should.not.exist(err);
          
            res.body.should.have.property('events');

            res.body.events.forEach(function(event) {
                FieldNames.details.forEach(function (field) {
                    event.should.have.property(field);
                });
            });
        });

        done();
    });


    it('GET /api/events/organization?q=' + encodeURIComponent('ieee-cs'), function (done) {
        client.get('/api/events/organization?q=' + encodeURIComponent('ieee-cs'))
        .expect(200)
        .end(function (err, res) {
            should.not.exist(err);
          
            res.body.should.have.property('events');

            res.body.events.forEach(function(event) {
                FieldNames.details.forEach(function (field) {
                    event.should.have.property(field);
                });
            });
        });
        
        done();
    });

    it('GET /api/events/category?q=' + encodeURIComponent('events'), function (done) {
        client.get('/api/events/category?q=' + encodeURIComponent('events'))
        .expect(200)
        .end(function (err, res) {
            should.not.exist(err);
          
            res.body.should.have.property('events');

            res.body.events.forEach(function(event) {
                FieldNames.details.forEach(function (field) {
                    event.should.have.property(field);
                });
            });
        });
        
        done();
    });

    it('GET /api/events/subCategory?q=' + encodeURIComponent('applied engineering'), function (done) {
        client.get('/api/events/subCategory?q=' + encodeURIComponent('applied engineering'))
        .expect(200)
        .end(function (err, res) {
            should.not.exist(err);
          
            res.body.should.have.property('events');

            res.body.events.forEach(function(event) {
                FieldNames.details.forEach(function (field) {
                    event.should.have.property(field);
                });
            });
        });
        
        done();
    });

    
});

