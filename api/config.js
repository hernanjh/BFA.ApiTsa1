var account = {
    address : process.env.ACCOUNTADDRESS,
    privateKey : Buffer.from(
        process.env.ACCOUNTPRIVATEKEY,
        'hex',
    ),
}

var contract = {
    CURRENT_CONTRACT_VERSION : "01",
    address : "0x7cbf323520d6fda0858b85dc357db6143fbe997b",
    ABI : [{"constant":true,"inputs":[{"name":"ots","type":"string"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ots","type":"string"}],"name":"getBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ots","type":"string"},{"name":"file_hash","type":"string"}],"name":"verify","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"selfDestroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ots","type":"string"},{"name":"file_hash","type":"string"}],"name":"stamp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"accountAddress"},{"indexed":true,"name":"hash","type":"string"},{"indexed":true,"name":"ots","type":"string"}],"name":"Stamped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"accountAddress"}],"name":"Deploy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"accountAddress"}],"name":"SelfDestroy","type":"event"}]
}

var server = {
    url:process.env.SERVER
}

var tx = {
	chainId: process.env.CHAINID || 200941592,
    gas: process.env.GAS || 250000,
	gasPrice: process.env.GASPRICE || 1000000000
}

exports.account = account;
exports.contract = contract;
exports.server = server;
exports.tx = tx;