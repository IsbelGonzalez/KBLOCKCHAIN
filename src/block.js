const SHA256 = require('crypto-js/sha256');
//Manera de gestionar el algoritmo de Minado
//Si sube la difficultad se relentiza la generacion de nuevos bloques
//Balance la creacion de nuevos bloques para no saturar la red
const DIFFICULTY = 3;

//Comstante de Minado: Cantidad de milisegundos entre bloque y bloque (3 segundos entre bloque y bloque)
const MINE_RATE = 3000;

class Block {
    constructor(time, previousHash, hash, data, nonce, difficulty ){
        this.time = time;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static get genesis (){
        const time = new Date('2009-03-01').getTime();
        return new this(time, undefined, "genesis-hash", "Genesis Block", 0, DIFFICULTY) 
    }

    //Algoritmo de minado
    //La creacion de un nuevo bloque se realiza a travez de un algoritmo para crear un nuevo hash.
    //Crear Hash, crear nuevo bloque con nuevo hash y agregar a la blockchain

    //Statick no hay necesidad de crear un nuevo bloque para llamar a esta funcion
    //recibe el bloque anterior y los datos para el nuevo bloque
    static mine (previousBlock , data){
        const {hash: previousHash} = previousBlock;
        let {difficulty} =  previousBlock;
        let hash;
        let time;
        //Nonce: Numero de vueltas que da el algoritmo hasta encontrar el Hash bucado
        let nonce = 0;

        do {
            time = Date.now();
            nonce += 1;
            difficulty = previousBlock.time + MINE_RATE > time ? difficulty + 1 : difficulty - 1;
            //Como se usan todos los datos para calcular el hash si malisiosamente se manipula alguno de los datos el hash calculado no coincide con el hash 
            hash =  SHA256(previousHash + time + data + nonce + difficulty).toString();

            //Miestras el hash no contenga tantos ceros en el inicio como la dificultad
            //0000234987234 diferente 0000 si dificultad es 4
        } while (hash.substring(0, difficulty) != "0".repeat(difficulty));
        
        return new this(time, previousHash, hash, data, nonce, difficulty);

    }

    toString(){
        const {time, previousHash, hash, data, nonce, difficulty} = this;
        return `Block - 
                Time: ${time}
                Previou Hash: ${previousHash}
                Hash: ${hash}
                Data: ${data}
                Nonce: ${nonce}
                Difficulty: ${difficulty}
                --------------------------------------- `;
    }
}
module.exports = Block;
