const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');

  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);


router.get('/', async (req,res) => {

    try{

    await client.connect();

    var nom_hotel,commentaire;

    nom_hotel = await client.db("aws").collection("Hotel").find({ 

      ID_HOTEL: Number(req.query.id) },{projection :     
        
        {nom:1,prix:1,ville:1,_id:0,ID_HOTEL:1}}).toArray();
   
        commentaire = await client.db("aws").collection("Commentaire").find({ 

        id_hotel: Number(req.query.id) },{projection :     
          
          {contenu:1,_id:1}}).toArray();
        
        res.render('rooms-details',{date_deb: req.query.date_deb,date_fin: req.query.date_fin,data: nom_hotel,i: req.query.i,com: commentaire});

    } catch (e) {
            console.error(e);
    } finally {
        client.close();
    }

})


router.post('/', async (req,res) => {
    const obj = Object.assign({},req.body);
    try{

    await client.connect();

    var nom_hotel1;
    var commentaire1;


   const id_c = await client.db("aws").collection("Commentaire").find({},{projection:{ID_Com:1}}).sort( { ID_Com: -1 } ).limit(1).toArray();
    
    await client.db("aws").collection("Commentaire").insertOne(
        {ID_Com: id_c[0].ID_Com+1,contenu: obj.message,id_hotel: Number(req.query.id)});


          nom_hotel1 = await client.db("aws").collection("Hotel").find({ 

            ID_HOTEL: Number(req.query.id) },{projection :     
              
              {nom:1,prix:1,ville:1,_id:0,ID_HOTEL:1}}).toArray();

              commentaire1 = await client.db("aws").collection("Commentaire").find({ 

                id_hotel: nom_hotel1[0].ID_HOTEL },{projection :     
                  
                  {contenu:1,_id:1}}).toArray();
              console.log(commentaire1);
        
        res.render('rooms-details',{date_deb: req.query.date_deb,date_fin: req.query.date_fin,data: nom_hotel1,i: req.query.i,com: commentaire1});

    } catch (e) {
            console.error(e);
    } finally {
        client.close();
    }

})



module.exports = router;