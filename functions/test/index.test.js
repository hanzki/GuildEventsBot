const sinon = require('sinon');
const functions = require('../index');

describe('listEvents', function() {
    describe('Simple request', function() {
        it('should respond with JSON', function() {
            const responseAPI = {
                setHeader: function (key, value) {},
                send: function (data) {}
            };

            const mock = sinon.mock(responseAPI);
            mock.expects('setHeader').withArgs('Content-Type', 'application/json');
            mock.expects('send').once();

            functions.listEvents({}, responseAPI);

            mock.verify();
        });
    });
});