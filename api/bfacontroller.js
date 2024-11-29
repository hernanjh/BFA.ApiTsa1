const bodyParser = require('body-parser');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const base64 = require('nodejs-base64-encode');
const sha256 = require('js-sha256');
const utils = require('./utils.js');
const config = require('./config.js');

const web3 = new Web3(new Web3.providers.HttpProvider(config.server.url))
const contract = new web3.eth.Contract(config.contract.ABI, config.contract.address);


module.exports = {

stamp : async function (req, res){   

    const now = new Date();
    try{
        const file_hash = req.body.file_hash;

        
        var ots;
        const timeStamp = now.getTime();

        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : Stamp (" + file_hash + ")");

        var hash = sha256.create();
        hash.update(file_hash.toString() + config.account.address.toString() + config.contract.address.toString() + timeStamp.toString());
        ots = hash.hex() + config.contract.CURRENT_CONTRACT_VERSION;


        const txCount = await web3.eth.getTransactionCount(config.account.address);

        const data = contract.methods.stamp(ots, file_hash).encodeABI();

        // Construir la transaccion
        const txObject = {
            nonce: web3.utils.toHex(txCount),
            chainId: config.tx.chainId,
            to: config.contract.address,		
            gas: config.tx.gas,
            // TODO: revisar que el precio sea automático
            gasPrice: config.tx.gasPrice,
            data: data
        }

        // Firmar la transaccion
        const tx = new Tx(txObject);
        tx.sign(config.account.privateKey);

        
        const serializeTransaction = tx.serialize();
        const raw = '0x' + serializeTransaction.toString('hex');

        // Transmitir la transacción
        const tx_sended = await web3.eth.sendSignedTransaction(raw);
        const tx_hash = tx_sended.transactionHash;
        comprobante_ots = '0x-' + ots + '-' + tx_hash;

        // Si está todo bien, retorno el OpenTimeStamp definitivo para luego comprobar si el hash del archivo junto con este comprobante son válidos
        comprobante_ots = base64.encode(comprobante_ots.toString(), 'base64');
        
        return res.json({
            temporary_rd: comprobante_ots,
            status: "success"
        });
    }
    catch(err){

        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : ERROR Stamp : ", err);

        return res.status(500).json({
            messages: "No se pudo realizar la operacion",
            status: "failure"
        });
    };
},

verify : async function (req, res){   

    const now = new Date();	
    try{
        
	  	const file_hash = req.body.file_hash;
	  	const base64_ots = req.body.rd;	  
        

        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : Verify (" + file_hash + ", "+ base64_ots + ")");

	  	// Transformo datos
	  	const aux_ots = base64.decode(base64_ots.toString(), 'base64');
	  	var array_ots = aux_ots.split('-');
	  	
	  	// OTS definitivo  	
	  	var permanent_ots;

        const ispermanent = array_ots[0] == '1x'? true : false;
        var ots = "";
	  	var tx_hash = "";

        //Si el ots enviado a verificar es el permanente o el temporal
        if(ispermanent)
        {
            ots = array_ots[2];
            tx_hash = array_ots[3];
        }
        else{
            ots = array_ots[1];
            tx_hash = array_ots[2];
        }
	  	

        var tx = await web3.eth.getTransaction(tx_hash);

        // Significa que la TX aún no se incluye en un bloque.
        if(!tx.blockNumber){
            return res.json({
                messages: "La transacción se encuentra pendiente de subida a la Blockchain",
                status: "pending"
            });
        }
        // Verifico si el OTS + File_Hash enviado son válidos
        const result_verify = await contract.methods.verify(ots,file_hash).call({from: config.account.address});

        if(result_verify){

            const block_number = await contract.methods.getBlockNumber(ots).call();
            
            // Tengo que obtener el bloque entero, para sacar su timestamp
            const block = await web3.eth.getBlock(block_number);
            
            var permanent_ots = "1x" + '-' + file_hash + '-' + ots + '-' + tx_hash + '-' + block_number
            permanent_ots = base64.encode(permanent_ots.toString(), 'base64');
            
            var d = new Date(block.timestamp * 1000);
            var date_block = utils.dateFormat(d, "%d/%m/%Y %H:%M:%S", false);
            
            return res.json({
                permanent_rd: permanent_ots,
                messages: "El archivo "+file_hash+" fue ingresado en el bloque "+block_number+" el "+ date_block,
                status: "success",		
                attestation_time: date_block,
            });
        

        } else {
            
            return res.status(404).json({
                messages: "No se encontró el archivo",
                status: "failure"		
            });	 
            
        }
    }
    catch(err){
        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : ERROR Verify : ", err);

        return res.status(500).json({
            messages: "No se pudo realizar la operacion",
            status: "failure"
        });
        
    }
  },

  balance : async function (req, res){   
    const now = new Date();	
    try{
        const account = req.query.account || config.account.address;
        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : balance : ("+account+")");

        var bal = await web3.eth.getBalance(account);
        var eth = web3.utils.fromWei(bal, "ether") + " ETH";

        return res.json({
            account: account,
            balanceETH: eth,
            balanceWEI: bal
        });
    }
    catch(err){

        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : ERROR  balance : ", err);

        return res.status(500).json({
            messages: "No se pudo realizar la operacion",
            status: "failure"
        });
        
    }
  },
  block : async function (req, res){   
    const now = new Date();	
    try{
        const block_number = req.query.number;
        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : block : ("+block_number+")");

        const block = await web3.eth.getBlock(block_number);

        return res.json(block);
    }
    catch(err){

        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : ERROR  block : ", err);

        return res.status(500).json({
            messages: "No se pudo realizar la operacion",
            status: "failure"
        });
        
    }
  } ,
  tx : async function (req, res){   
    const now = new Date();	
    try{
        const tx_hash = req.query.hash;
        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : tx : ("+tx_hash+")");

        var tx = await web3.eth.getTransaction(tx_hash);

        return res.json(tx);
    }
    catch(err){

        console.log("[" + utils.dateFormat(now, "%d/%m/%Y %H:%M:%S", false) + "] : ERROR  tx : ", err);

        return res.status(500).json({
            messages: "No se pudo realizar la operacion",
            status: "failure"
        });
        
    }
  } 

} 




