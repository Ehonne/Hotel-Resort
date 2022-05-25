const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');

  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);


router.post('/', async (req, res) => {
const obj = Object.assign({},req.body);
try{
    await client.connect();

    /*await client.db("aws").collection("Client").find({},{projection:{ID_CLIENT:1}}).sort( { ID_CLIENT: -1 } ).limit(1).
    forEach(function (addnewres)
             {
               console.log(addnewres);
               client.db("aws").collection("Client").insertOne(
                {ID_CLIENT: addnewres.ID_CLIENT+1,nom: "s",prenom: "a",N_tel: "000",adr_mail: "sa@g.com",pays: "France",
                    mot_de_passe: "ss",fidelite: 0});
               });*/

    const tuple_client = await client.db("aws").collection("Client").findOne( { adr_mail: obj.email });
       
            if(tuple_client){

                res.status(400).send(" L'adresse mail que vous avez saisi existe deja ! ");  
            }
            
            else{           
               
                const id_c = await client.db("aws").collection("Client").find({},{projection:{ID_CLIENT:1}}).sort( { ID_CLIENT: -1 } ).limit(1).toArray();
                
                await client.db("aws").collection("Client").insertOne(
                    {ID_CLIENT: id_c[0].ID_CLIENT+1,nom: obj.First_name ,prenom: obj.Last_name,N_tel: obj.phone_number,adr_mail: obj.email,pays: obj.country,
                    mot_de_passe: obj.password,fidelite: 0});
                
                }

        res.status(200).send(" Your account has been created ! ");  

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
  });
  

module.exports = router;