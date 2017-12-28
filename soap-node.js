String.prototype.replaceAll = function (search, replacement) { var target = this; return target.split(search).join(replacement); };

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
        this.status({});

        try {
            node.on('input', function (msg) {
                var server = (msg.server)?{wsdl:msg.server, auth:0}:node.server;
                var lastFiveChar = server.wsdl.substr(server.wsdl.length-5);
                if(lastFiveChar !== '?wsdl'){
                    server.wsdl += '?wsdl';
                };
                soap.createClient(server.wsdl, msg.options||{}, function (err, client) {
                    if (err) {
                        node.status({fill: "red", shape: "dot", text: "WSDL Config Error: " + err});
                        node.error("WSDL Config Error: " + err);
                        return;
                    }
                    switch (node.server.auth) {
                        case '1':
                            client.setSecurity(new soap.BasicAuthSecurity(server.user, server.pass));
                            break;
                        case '2': {
                            if (typeof server.key === 'string'
                                && typeof server.cert === 'string'
                                && server.key.startsWith("-----BEGIN")
                                && server.cert.startsWith("-----BEGIN")) {
                                
                                var keyBuffer = Buffer.from(server.key, 'utf-8');
                                var certBuffer = Buffer.from(server.cert, 'utf-8');
                                
                                client.setSecurity(new soap.ClientSSLSecurity(keyBuffer, certBuffer, {}));
                            } else {
                                client.setSecurity(new soap.ClientSSLSecurity(server.key, server.cert, {}));
                            }
                        }
                            break;
                        case '3':
                            client.setSecurity(new soap.WSSecurity(server.user, server.pass));
                            break;
                        case '4':
                            client.setSecurity(new soap.BearerSecurity(server.token));
                            break;
                    }
                    node.status({fill: "yellow", shape: "dot", text: "SOAP Request..."});
                    if(msg.headers){
                        client.addSoapHeader(msg.headers);
                    }

                    if(client.hasOwnProperty(node.method)){
                        client[node.method](msg.payload, function (err, result) {
                            if (err) {
                                node.status({fill: "red", shape: "dot", text: "Service Call Error: " + err});
                                node.error("Service Call Error: " + err);
                                return;
                            }
                            node.status({fill:"green", shape:"dot", text:"SOAP result received"});
                            node.send({payload: result});
                        });
                    } else {
                        node.status({fill:"red", shape:"dot", text:"Method does not exist"});
                        node.error("Method does not exist!");
                    };
                });
            });
        } catch (err) {
            node.status({fill: "red", shape: "dot", text: err.message});
            node.error(err.message);
        }
    }
    RED.nodes.registerType("soap request", SoapCall);
};