const sinon = require('sinon');
const index = require('..');

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

            index.listEvents({}, responseAPI);

            mock.verify();
        });
    });
});