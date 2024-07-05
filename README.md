# progetto_nodejs_mongodb_robertaciresa

# Spiegazione del progetto: 

LookBook è un’app per la vendita di abbigliamento second hand.
Il progetto prevede la creazione di API JSON RESTful.

Come previsto dal progetto, l'app prevede l'istanza di Utenti, Articoli e Ordini.
Ogni utente deve avere un nome, un cognome e un'email.
Ogni articolo deve avere un titolo e una taglia, può avere un numero di foto a proprio piacere.
Ogni ordine deve avere un utente (che effettua l'ordine) e n articoli (che l'utente vuole acquistare). Sarà generata automaticamente la data di creazione dell'ordine.

Le query impostate permettono per ogni componente (utenti, articoli, ordini) di richiedere la lista completa o con filtri opzionali, un -u,a,o- con specifico id, permettono inoltre, la creazione, l'aggiornamento e l'eliminazione di ogni -u,a,o-.

Vengono quindi effettuate richieste GET, POST, PUT, DELETE (CRUD).

# Tecnologie utilizzate: 

Come da specifiche, e con qualche aggiunta per mia volontà, le tecnologie utilizzate nel progetto sono:

- Node.js
- Express
- Mongo DB (con Atlas e Compass)
- Mongoose
- Body-parser
- Dotenv
- Jest
- Supertest
- Mongodb-memory-server

# Come è strutturato il progetto: 

Il progetto prevede la seguente struttura:

- file necessari al progetto come la cartella node-modules e il file package.json 
- file principale server.js
- una cartella controllers contenente i diversi controller (userController.js, articleController.js, orderController.js)
- una cartella models contenente i modelli necessari a Mongo DB per definire la struttura del database (user.js, article.js e order.js)
- una cartella routes che contiene i file in cui si definiscono le rotte per le diverse query (usersRoutes.js, articlesRoutes.js, ordersRoutes.js)
- una cartella __tests__ che contiene i file di test (usersController.test.js, articlesController.test.js, ordersController.test.js)

# Piccola parentesi sui test: 

Nel programma è presente una cartella contenente i file per i test automatizzati, una volta installate tutte le dipendenze, è possibile eseguire i test digitando a terminale npm test -nome del file di test-, cosicchè i test possano avvenire uno alla volta senza errori in fase di collegamento al DB.

Per lo stesso motivo ho creato un db secondario, in locale, utilizzato solo per eseguire i test automatizzati. 

Nel caso si volesse testare con mano il funzionamento del programma (io lo preferisco nei casi in cui la mole di lavoro non è troppo esagerata), è possibile eseguire i test manualmente con postman, per verificare che tutto funzioni e per vedere coi propri occhi le risposte del server, creare utenti o articoli secondo le nostre preferenze, ecc.

Nelle prossime slide il dettaglio degli endpoint per effettuare test con postman.

# Endpoint test Users

1. Endpoint per ottenere tutti gli ordini con filtri opzionali.
Metodo: GET URL: http://localhost:3000/users
Parametri Query (opzionali):
firstName: completo o parziale, lastName: completo o parziale, email: completo o parziale,

2. Endpoint per ottenere un ordine specifico per ID.
Metodo: GET URL: http://localhost:3000/users/:id

3. Endpoint per creare un nuovo ordine.
Metodo: POST URL: http://localhost:3000/users
Body (JSON):
{ 
	“firstName” : “exName”,
	“lastName” : “exLastname”,
	“email” : “mail@example.com”
}

4. Endpoint per aggiornare un ordine esistente.
Metodo: PUT URL: http://localhost:3000/users/:id
Body JSON come create con dati aggiornati.

5. Endpoint per eliminare un ordine esistente.
Metodo: DELETE URL: http://localhost:3000/users/:id

# Endpoint test Articles

1. Endpoint per ottenere tutti gli ordini con filtri opzionali.
Metodo: GET URL: http://localhost:3000/articles
Parametri Query (opzionali):
title: completo o parziale, size: completo o parziale.

2. Endpoint per ottenere un ordine specifico per ID.
Metodo: GET URL: http://localhost:3000/articles/:id

3. Endpoint per creare un nuovo ordine.
Metodo: POST URL: http://localhost:3000/articles
Body (JSON):
{ 
	“title” : “exTitle”,
	“size” : “exSize”,
	“images” : [{
            "data": "<base64_encoded_data>",
            "contentType": "image/jpeg",
            "description": "Descrizione dell'immagine"
        }]
}

4. Endpoint per aggiornare un ordine esistente.
Metodo: PUT URL: http://localhost:3000/articles/:id
Body JSON come create con dati aggiornati.

5. Endpoint per eliminare un ordine esistente.
Metodo: DELETE URL: http://localhost:3000/articles/:id

# Endpoint test Orders

1. Endpoint per ottenere tutti gli ordini con filtri opzionali.
Metodo: GET URL: http://localhost:3000/orders
Parametri Query (opzionali):
user: ID dell'utente, articles: Elenco separato da virgola di ID degli articoli, date: Data in formato es. 2024-07-05.

2. Endpoint per ottenere un ordine specifico per ID.
Metodo: GET URL: http://localhost:3000/orders/:id

3. Endpoint per creare un nuovo ordine.
Metodo: POST URL: http://localhost:3000/orders
Body (JSON):
{
    "user": "user_id",
    "articles": ["article_id1", "article_id2"] 
}

4. Endpoint per aggiornare un ordine esistente.
Metodo: PUT URL: http://localhost:3000/orders/:id
Body (JSON):
{
    "articles": ["new_article_id1", "new_article_id2"] 
}

5. Endpoint per eliminare un ordine esistente.
Metodo: DELETE URL: http://localhost:3000/orders/:id