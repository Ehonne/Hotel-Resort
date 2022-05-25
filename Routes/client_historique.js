const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');
  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);


//Get historique des reservations
router.get('/', async (req, res) => {
    try{
        await client.connect();
        const result1 = await client.db("aws").collection("Reservation").find({id_client: 35}).toArray();
        res.render("historique",{data: result1});
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
        }
        
      });

module.exports = router;