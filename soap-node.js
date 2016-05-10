module.exports = function (RED) {
    function SoapCall(n) {
        var soap = require('soap');
        RED.nodes.createNode(this, n);
        this.topic = n.topic;
        this.name = n.name;
        this.wsdl = n.wsdl;
        this.server = RED.nodes.getNode(this.wsdl);
        this.method = n.method;
        this.payload = n.payload;
        var node = this;
        try {
            node.on('input', function (msg) {
                soap.createClient(node.server.wsdl, function (err, client) {
                    if (err) {
                        throw new Error("WSDL Config Error: " + err);
                    }
                    switch (node.server.auth) {
                        case '1':
                            client.setSecurity(new soap.BasicAuthSecurity(node.server.user, node.server.pass));
                            break;
                        case '2':
                            client.setSecurity(new soap.ClientSSLSecurity(node.server.key, node.server.cert, {}));
                            break;
                        case '3':
                            client.setSecurity(new soap.WSSecurity(node.server.user, node.server.pass));
                            break;
                        case '4':
                            client.setSecurity(new soap.BearerSecurity(node.server.token));
                            break;
                    }
                    node.status({fill: "green", shape: "dot", text: "SOAP Request..."});
                    client[node.method](msg.payload, function (err, result) {
                        if (err) {
                            throw new Error("Service Call Error: " + err);
                        }
                        node.status({});
                        node.send({payload: result});
                    });
                });
            });
        } catch (err) {
            node.status({fill: "red", shape: "dot", text: err.message});
            node.error(err.message);
        }
    }
    RED.nodes.registerType("soap request", SoapCall);
};
