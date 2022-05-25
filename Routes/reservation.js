const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');

  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const hotelID = require('mongoose').Types.ObjectId; // recupere l id de l'hotel 


router.get('/', async (req, res) => 
{
       try{

        await client.connect();

    var nom_hotel;

    nom_hotel = await client.db("aws").collection("Hotel").find({ 

      ID_HOTEL: Number(req.query.id) },{projection :     
        
        {nom:1,prix:1,_id:1,ID_HOTEL:1}}).toArray();

        res.render('booking-system',{date_deb: req.query.date_deb,date_fin: req.query.date_fin,data: nom_hotel});

    } catch (e) {
            console.error(e);
    } finally {
        client.close();
    }
})


router.post('/', async (req, res) => {

    const obj = Object.assign({},req.body);
    try{

        await client.connect();
    
        const tuple_client = await client.db("aws").collection("Client").findOne( { adr_mail: obj.email });
       
            if(tuple_client){

                res.status(400).send(" L'adresse mail que vous avez saisi existe deja ! ");  
            }
            
            else{

        /*-------------*/ 

                const id_c = await client.db("aws").collection("Client").find({},{projection:{ID_CLIENT:1}}).sort( { ID_CLIENT: -1 } ).limit(1).toArray();
    
                await client.db("aws").collection("Client").insertOne(
                    {ID_CLIENT: id_c[0].ID_CLIENT+1,nom: obj.first_name ,prenom: obj.last_name,N_tel: obj.n_tel,adr_mail: obj.email,pays: obj.Country,
                    mot_de_passe: obj.password[0],fidelite: 0});


                const id_r = await client.db("aws").collection("Reservation").find({},{projection:{ID_RES:1}}).sort( { ID_RES: -1 } ).limit(1).toArray();

                const id_h = await client.db("aws").collection("Hotel").find({ID_HOTEL: Number(req.query.id)}).toArray();
                
                console.log(req.query.date_fin);
                console.log(req.query.date_deb);
                await client.db("aws").collection("Reservation").insertOne(
                {ID_RES: id_r[0].ID_RES+1,id_hotel: id_h[0].ID_HOTEL,id_client: id_c[0].ID_CLIENT+1,date_deb: req.query.date_deb,date_fin: req.query.date_fin});

                 res.render("fin_de_reservations",{nom: obj.first_name,

                prenom: obj.last_name,adr_mail: obj.email,pays: obj.Country,
                date_deb: req.query.date_deb,date_fin: req.query.date_fin, 
                prix: id_h[0].prix, Hotel: id_h[0].nom
                 
                 });

        }
        
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
        }


      });



module.exports = router;