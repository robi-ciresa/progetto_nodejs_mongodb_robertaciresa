# progetto_nodejs_mongodb_robertaciresa

# Spiegazione del progetto: 

LookBook è un’app per la vendita di abbigliamento second hand.
Il progetto prevede la creazione di API JSON RESTful.

Nonostante non fosse previsto come requisito fondamentale del progetto ho scelto di implementare una sorta di front-end molto semplice per semplificare l'inserimento dei dati, la modifica e l'eliminazione, come richiesto (in alternativa all'uso di Postman).

Nonostante nel front-end già vengano eseguite le richieste get, post, put, e delete per gli articoli, gli utenti e gli ordini, ho pensato di aggiungere un ulteriore controller che fornisse in risposta a delle semplici richieste GET (con o senza filtri) dei file di tipo json.

# Tecnologie utilizzate: 

Come da specifiche, e con qualche aggiunta per mia volontà, le tecnologie utilizzate nel progetto sono:

- Node.js
- Express
- Mongo DB (con Atlas)
- Mongoose
- EJS
- Multer
- Jest
- Supertest

# Come è strutturato il progetto: 

Il progetto prevede la seguente struttura:

- file necessari al progetto come la cartella node-modules e il file package.json 
- file principale server.js
- una cartella controllers contenente i diversi controller (userController.js, articleController.js, orderController.js, e jsonController.js)
- una cartella models contenente i modelli necessari a Mongo DB per definire la struttura del database (user.js, article.js e order.js)
- una cartella public dove vengono salvate le immagini degli articoli
- una cartella routes che contiene il file allroutes.js per la definizione delle rotte
- una cartella views che contiene le viste in .ejs per il front-end
- una cartella tests che contiene i file di test (userController.test.js, articleController.test.js, orderController.test.js, e jsonController.test.js)

# Piccola parentesi sui test: 

I file di test sono momentaneamente rinominati con nomi errati (es. userController.tet.js), questo perchè ogni file di test viene eseguito separatamente per evitare conflitti tra i diversi file nel tentare l'accesso al database.

Per eseguire il test sarà quindi necessario rendere uno alla volta i file disponibili rinominandoli con il nome corretto (es. userController.test.js), ed eseguire il comando npm test da terminale.

Nei test dei controller specifici per user, article e order non viene testata la richiesta GET (che viene invece testata nel test del controller per json) in quanto si può verificare che la richiesta GET funzioni direttamente da front-end.
