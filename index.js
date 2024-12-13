//Importation des modules express et mysql dans le fichier
const express = require('express');
const mysql = require('mysql');

//Création d'une application Express
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

//Configuration du serveur pour qu'il écoute sur le port 3000
const port = 3000;

//Importation de la configuration du fichier config.js (connexion à la base de données)
const config = require('./config');
const connection = mysql.createConnection(config);

connection.connect(err => {
    //Vérification des erreurs lors de la connexion.
    if (err) {
        //Affichage d'un message d'erreur en cas d'échec de la connexion
        console.error('Error connecting to the database :', err.stack);
        return;
    }
    //Affichage d'un message de confirmation en cas de réussité de la connexion.
    console.log('Connected to the database');
})

//API pour la table "transactions"

//GET - Récupérer tous les éléments
app.get('/transactions', (req, res) => {
    connection.query('SELECT * FROM transactions ORDER BY date', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//GET - Récupérer un élément
app.get('/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT * FROM transactions WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// GET - Récupérer la somme des dépenses
app.get('/sum', (req, res) => {
    const query = 'SELECT SUM(amount) AS totalAmount FROM transactions';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        // Vérifie que la réponse contient des données valides
        if (results && results[0] && results[0].totalAmount !== null) {
            res.json({ totalAmount: results[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 }); // Retourne 0 si aucune dépense n'est trouvée
        }
    });
});

// GET - Récupérer la somme des dépenses passées
app.get('/sum-past', (req, res) => {
    const query = 'SELECT SUM(amount) AS totalAmount FROM transactions WHERE statut = "effectuée"';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        // Vérifie que la réponse contient des données valides
        if (results && results[0] && results[0].totalAmount !== null) {
            res.json({ totalAmount: results[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 }); // Retourne 0 si aucune dépense n'est trouvée
        }
    });
});

// GET - Récupérer la somme des dépenses futures
app.get('/sum-future', (req, res) => {
    const query = 'SELECT SUM(amount) AS totalAmount FROM transactions WHERE statut = "a venir"';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        // Vérifie que la réponse contient des données valides
        if (results && results[0] && results[0].totalAmount !== null) {
            res.json({ totalAmount: results[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 }); // Retourne 0 si aucune dépense n'est trouvée
        }
    });
});

//POST - Ajouter un nouvel élément
app.post('/transactions', (req, res) => {
    const item = req.body;
    console.log(item);
    const query = 'INSERT INTO transactions (amount,category,statut,date,description) VALUES (?,?,?,?,?)';
    connection.query(query, [item.amount, item.category, item.statut, item.date, item.description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, ...item });
    })
})

//PUT - Mettre à jour un élément existant
app.put('/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newItem = req.body;
    const query = 'UPDATE transactions SET amount = ?, category = ?, statut = ?,  date = ?, description = ? WHERE id = ?';
    connection.query(query, [newItem.amount, newItem.category, newItem.statut, newItem.date, newItem.description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(newItem);
    })
})

//DELETE - Supprimer un élément
app.delete('/transactions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM transactions WHERE id= ?'
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(204).send();
    }
    )
})

// API pour la table "incomes"

//GET - Récupérer tous les éléments
app.get('/revenus', (req, res) => {
    connection.query('SELECT * FROM incomes ORDER BY date', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//GET - Récupérer un élément
app.get('/revenus/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT * FROM incomes WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// GET - Récupérer la somme des revenus
app.get('/sum-incomes', (req, res) => {
    const query = 'SELECT SUM(amount) AS totalAmount FROM incomes';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        // Vérifie que la réponse contient des données valides
        if (results && results[0] && results[0].totalAmount !== null) {
            res.json({ totalAmount: results[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 }); // Retourne 0 si aucune dépense n'est trouvée
        }
    });
});

// GET - Récupérer la somme des revenus passés
app.get('/sum-past-incomes', (req, res) => {
    const query = 'SELECT SUM(amount) AS totalAmount FROM incomes WHERE statut = "effectuée"';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        // Vérifie que la réponse contient des données valides
        if (results && results[0] && results[0].totalAmount !== null) {
            res.json({ totalAmount: results[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 }); // Retourne 0 si aucune dépense n'est trouvée
        }
    });
});

// GET - Récupérer la somme des revenus futurs
app.get('/sum-future-incomes', (req, res) => {
    const query = 'SELECT SUM(amount) AS totalAmount FROM incomes WHERE statut = "a venir"';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'exécution de la requête :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        // Vérifie que la réponse contient des données valides
        if (results && results[0] && results[0].totalAmount !== null) {
            res.json({ totalAmount: results[0].totalAmount });
        } else {
            res.json({ totalAmount: 0 }); // Retourne 0 si aucune dépense n'est trouvée
        }
    });
});


//POST - Ajouter un nouvel élément
app.post('/revenus', (req, res) => {
    const item = req.body;
    console.log(item);
    const query = 'INSERT INTO incomes (amount,category,statut,date,description) VALUES (?,?,?,?,?)';
    connection.query(query, [item.amount, item.category, item.statut, item.date, item.description], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, ...item });
    })
})

//PUT - Mettre à jour un élément existant
app.put('/revenus/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newItem = req.body;
    const query = 'UPDATE incomes SET amount = ?, category = ?, statut = ?,  date = ?, description = ? WHERE id = ?';
    connection.query(query, [newItem.amount, newItem.category, newItem.statut, newItem.date, newItem.description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(newItem);
    })
})

//DELETE - Supprimer un élément
app.delete('/revenus/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM incomes WHERE id= ?'
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(204).send();
    }
    )
})


// API pour la table "savings"

//GET - Récupérer tous les éléments
app.get('/epargne', (req, res) => {
    connection.query('SELECT amount FROM savings', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//GET - Récupérer un élément
app.get('/epargne/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT amount FROM savings WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//POST - Ajouter un nouvel élément
app.post('/epargne', (req, res) => {
    const item = req.body;
    console.log(item);
    const query = 'INSERT INTO savings (amount) VALUES (?)';
    connection.query(query, [item.amount], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, ...item });
    })
})

//PUT - Mettre à jour un élément existant
app.put('/epargne/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log('id :', id);
    const newItem = req.body.amount;
    console.log('Données reçues :', newItem);
    const query = 'UPDATE savings SET amount = ? WHERE id = ?';
    connection.query(query, [newItem, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(newItem);
    })
})

//DELETE - Supprimer un élément
app.delete('/epargne/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM savings WHERE id= ?'
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(204).send();
    }
    )
})

// API pour la table "savings_incomes"

//GET - Récupérer tous les éléments
app.get('/epargne-revenus', (req, res) => {
    connection.query('SELECT * FROM savings_incomes ORDER BY id DESC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//GET - Récupérer un élément
app.get('/epargne-revenus/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT * FROM savings_incomes WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//POST - Ajouter un nouvel élément
app.post('/epargne-revenus', (req, res) => {
    const item = req.body;
    console.log(item);
    const query = 'INSERT INTO savings_incomes (amount,category) VALUES (?,?)';
    connection.query(query, [item.amount, item.category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, ...item });
    })
})

//PUT - Mettre à jour un élément existant
app.put('/epargne-revenus/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newItem = req.body;
    const query = 'UPDATE savings_incomes SET amount = ?, category = ?, description = ? WHERE id = ?';
    connection.query(query, [newItem.amount, newItem.category, newItem.description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(newItem);
    })
})

//DELETE - Supprimer un élément
app.delete('/epargne-revenus/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM savings_incomes WHERE id= ?'
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(204).send();
    }
    )
})


// API pour la table "savings_expenses"

//GET - Récupérer tous les éléments
app.get('/epargne-depenses', (req, res) => {
    connection.query('SELECT * FROM savings_expenses ORDER BY id DESC', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//GET - Récupérer un élément
app.get('/epargne-depenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('SELECT * FROM savings_expenses WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

//POST - Ajouter un nouvel élément
app.post('/epargne-depenses', (req, res) => {
    const item = req.body;
    console.log(item);
    const query = 'INSERT INTO savings_expenses (amount,category) VALUES (?,?)';
    connection.query(query, [item.amount, item.category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, ...item });
    })
})

//PUT - Mettre à jour un élément existant
app.put('/epargne-depenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newItem = req.body;
    const query = 'UPDATE savings_expenses SET amount = ?, category = ?, description = ? WHERE id = ?';
    connection.query(query, [newItem.amount, newItem.category, newItem.description, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(newItem);
    })
})

//DELETE - Supprimer un élément
app.delete('/epargne-depenses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM savings_expenses WHERE id= ?'
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.status(204).send();
    }
    )
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})