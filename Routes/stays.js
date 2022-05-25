const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');

  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);



router.get('/', async (req, res) => {

    try{

        await client.connect();
       
            const id_c = await client.db("aws").collection("Hotel").find({},{projection :     
                {nom:1,ID_HOTEL:1,ville:1,prix:1,_id:1}}).toArray();

            res.render('hotel1',{data: id_c});
            
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
        }
      });

      module.exports = router;