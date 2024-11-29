# API REST - Sello de Tiempo v1 #

La aplicacion fue desarrollada en NodeJs utilizando el framework Express.
Fue basada en los repositorios de Renzo Mauro Ontivero https://gitlab.bfa.ar/renn_um/tsa1 y de Patricio Kumagae https://gitlab.bfa.ar/pkumagae/TsaAPI

La idea era desarrollar una api muy simple que cumpla con el propósito y cumpliendo con la misma interfaz que la API V1 original (https://gitlab.bfa.ar/blockchain/TSA)
Permite instalarla por fuera del nodo transaccional (opentx) , tanto en un server tradicional como tambien en contenedores docker.

# Instalacion en Docker
Iniciar la consola en el servidor donde se encuentra alojado el servicio de docker

* Luego descargar el repositorio
```
sudo git clone https://github.com/hernanjh/BFA.ApiTsa1.git
cd tsa1
```

* Compilar la imagen
```
docker build -t bfa/apitsa1:latest .
```

* El contenedor posee 3 variables de entorno que deben ser enviadas al momento de su ejecucion

```
ACCOUNTADDRESS: 0x25UHf0...... (direccion de la cuenta)
ACCOUNTPRIVATEKEY: 58HYUF5GHY5D...... (Clave privada de la cuenta)
SERVER: http://10.0.0.6:8545 (URL del servidor donde se encuentra el nodo transaccional opentx)
```

* Crear el contenedor
```
docker run -d --name apitsa1 -p 3030:3030 -e ACCOUNTADDRESS='0x25UHf0......' -e ACCOUNTPRIVATEKEY='58HYUF5GHY5D......' -e SERVER='http://10.0.0.6:8545'  bfa/apitsa1
```

# Instalacion en servidor

* Descargar la aplicacion
```
sudo git clone https://github.com/hernanjh/BFA.ApiTsa1.git
cd tsa1
```

* Instalar los modulos NPM
```
npm install
```

* Modificar el archivo api/config.js.  
Se debe modificar address, privateKey y server

```
var account = {
    address : '0x25UHf0......',
    privateKey : Buffer.from(
        '58HYUF5GHY5D......',
        'hex',
    ),
}

var contract = {
    CURRENT_CONTRACT_VERSION : "01",
    address : "0x7cbf323520d6fda0858b85dc357db6143fbe997b",
    ABI : [{"constant":true,"inputs":[{"name":"ots","type":"string"}],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ots","type":"string"}],"name":"getBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ots","type":"string"},{"name":"file_hash","type":"string"}],"name":"verify","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"selfDestroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ots","type":"string"},{"name":"file_hash","type":"string"}],"name":"stamp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"accountAddress"},{"indexed":true,"name":"hash","type":"string"},{"indexed":true,"name":"ots","type":"string"}],"name":"Stamped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"accountAddress"}],"name":"Deploy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"accountAddress"}],"name":"SelfDestroy","type":"event"}]
}

var server = {
    url:'http://10.0.0.6:8545' 
}

exports.account = account;
exports.contract = contract;
exports.server = server;
```

* Iniciar la apliacion
```
npm start
```

# Probar la aplicación

### Verificar el RD temporal ###

Request:
```
POST /verify/ HTTP/1.1
Host: 127.0.0.1:3030
Content-Type: application/json

{
	"file_hash": "1277da84a1656e2fa197c7bc378741434632fa1928d69e6cb3780a7b06bc373r",
	"rd": "MXgtMTI3N2RhODRhMTY1NmUyZmExOTdjN2JjMzc4NzQxNDM0NjMyZmExOTI4ZDY5ZTZjYjM3ODBhN2IwNmJjMzczci04MDcwMzVkZjQ2NWRkMmNjYjNiYWZhYWJhNTIzNTI0Njc4MTQ1MDhiNmUxZGQ2NmJiNzgxYjM0M2IyM2IzM2FiMDEtMHg0YTY4NDIzMzU0Y2IwNTIwNWIyZmE3YzU0ZjU3MDdhZmE2NTAxNWVlNDlkMDVlNGIyYjE4NGM1ZTRiMzlhNmZkLTIxODMwNTkw"
}
```

Response:
```
{
    "attestation_time": "22/03/2022 17:14:15",
    "messages": "El archivo 1277da84a1656e2fa197c7bc378741434632fa1928d69e6cb3780a7b06bc373r fue ingresado en el bloque 21830590 el 22/03/2022 17:14:15",
    "permanent_rd": "MXgtMTI3N2RhODRhMTY1NmUyZmExOTdjN2JjMzc4NzQxNDM0NjMyZmExOTI4ZDY5ZTZjYjM3ODBhN2IwNmJjMzczci04MDcwMzVkZjQ2NWRkMmNjYjNiYWZhYWJhNTIzNTI0Njc4MTQ1MDhiNmUxZGQ2NmJiNzgxYjM0M2IyM2IzM2FiMDEtMHg0YTY4NDIzMzU0Y2IwNTIwNWIyZmE3YzU0ZjU3MDdhZmE2NTAxNWVlNDlkMDVlNGIyYjE4NGM1ZTRiMzlhNmZkLTIxODMwNTkw",
    "status": "success"
}
```
### Realizar el stamp ###

Request:
```
POST /stamp/ HTTP/1.1
Host: 127.0.0.1:3030
Content-Type: application/json

{
	"file_hash": "1277da84a1656e2fa197c7bc378741434632fa1928d69e6cb3780a7b06bc373r"
}
```

Response:
```
{
    "temporary_rd": "MHgtMjRlZDYzNTcwZGYwZTIwODQzOTJiYTY3NTcwYmVjNjY2ZGYxYTJjZTRkNGNkMjE5ZDNlMGQ3NWEyYzQ3YjU4MjAxLTB4YjgxOGI4NTgxNThlYWU3Y2MxMDhlZTZjZTg5MTY0OWY1ODM4MDg5MWIxNTk2NWQ4NjBhNDY3YjIyOWY2Nzk2OA==",
    "status": "success"
}
```
### Obtener el balance de una cuenta ###

Sin pasarle parametros devuelve el balance de la cuenta asociada enviada en la configuracion

Request:
```
GET /balance/ HTTP/1.1
Host: 127.0.0.1:3030
```
Response:
```
{
"account": "0x338a7a87b3dcc3c8c63bd0409d6e675a6aae6cg7",
"balanceETH": "1.55546250499755617 ETH",
"balanceWEI": "1555462504997556170"
}
```
Pasando el parametro account

Request:
```
GET /balance/?account=0x3h89E7d699ACFf56594cDe73092Ba43f02436A57 HTTP/1.1
Host: 127.0.0.1:3030
```
Response:
```
{
"account": "0x3h89E7d699ACFf56594cDe73092Ba43f02436A57",
"balanceETH": "7.737860586 ETH",
"balanceWEI": "7737860586000000000"
}
```

### Obtener datos de un bloque ###

Request:
```
GET /block/?number=21961817 HTTP/1.1
Host: 127.0.0.1:3030
```
Response:
```
{
"difficulty": "2",
"extraData": "0x343639393161646132613235343434363865622e3030353035363966666462396edc8946ba336de3b994ff463a4868d64330de7fd4dcbf425576bf3901f846a50b21d9cf7b1a5739487bff9bdb34366ebccbf3faf15cc56b5cb9af85c73c410901",
"gasLimit": 8000000,
"gasUsed": 47033,
"hash": "0x2e83ff804d214040f0ec6a066c29cbb4bad15a2610195304c88a63a50e19ea48",
"logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000",
"miner": "0x0000000000000000000000000000000000000000",
"mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
"nonce": "0x0000000000000000",
"number": 21961817,
"parentHash": "0x8a8b539e5bfddd979c09bfc183ab4d370eeb891af2d6bacb353638ae118fb91f",
"receiptsRoot": "0x7e8e6d8f7457ad41d316e0b98360ae524fc7eface7f8f9a6dda3fde2dad5b62d",
"sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
"size": 758,
"stateRoot": "0x95d120ee9f478a2e61fd0e7fed89e79153b1e6c9d92b514070b5e5ec7cb0a8cf",
"timestamp": 1648645078,
"totalDifficulty": "30658168",
"transactions": [
"0xb3fcd5ac121376b89e3e7b9ef34897c8a76f4db394ddf587eed62ba7ecb95996"
],
"transactionsRoot": "0xcb55dcfeed55c76a6e43e51c6020ea485e8cff6f51619b81b2177e393f3d0ca8",
"uncles": []
}
```

### Obtener datos de una transacción ###

Request:
```
GET /tx/?hash=0xb3fcd5ac121376b89e3e7b9ef34897c8a76f4db394ddf587eed62ba7ecb95996 HTTP/1.1
Host: 127.0.0.1:3030
```

Response:
```
{
"blockHash": "0x2e83ff804d214040f0ec6a066c29cbb4bad15a2610195304c88a63a50e19ea48",
"blockNumber": 21961817,
"from": "0x2b89E7d699ACFf56594cDe73092Ba43f02436A56",
"gas": 147033,
"gasPrice": "1000000000",
"hash": "0xb3fcd5ac121376b89e3e7b9ef34897c8a76f4db394ddf587eed62ba7ecb95996",
"input": "0xae7145db000000000000000000000000000000007085cc4b26f852d56dfbd80a70271d37",
"nonce": 584696,
"to": "0x618D74a94f584D1466379F4E20c04d37e685b26F",
"transactionIndex": 0,
"value": "0",
"type": 0,
"v": "0x17f44053",
"r": "0xb2831f661c4871ee37ab403bbaba89a9bae4d03d21c41c31c80352459522ee23",
"s": "0x785f1d18e865e4403a1dab0e1d6461bd5c45ac2833b95ac7e5c375a63290e604"
}
```