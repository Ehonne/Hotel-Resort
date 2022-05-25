const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');

  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);


//Get info perso
router.get('/', async (req, res) => {
    try{
        await client.connect();
        const personne = await client.db("aws").collection("Client").find( { ID_CLIENT : 35 }).toArray();
        res.render("info_perso",{data: personne});
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
        }
      });
      module.exports = router;