const express = require('express');
const router = express.Router();
const {MongoClient} = require('mongodb');

  
const uri = "mongodb+srv://salah:salah@cluster0.ugogl.mongodb.net/aws?retryWrites=true&w=majority";
const client = new MongoClient(uri);



router.post('/', async (req, res) => {

    const obj = Object.assign({},req.body);
    const forma_date_deb = obj.date_deb.replace('/','-');
    const forma_date_fin = obj.date_fin.replace('/','-');
    console.log(obj);
  const d_deb = forma_date_deb.replace('/','-');
            const d_fin = forma_date_fin.replace('/','-');
    try{

        await client.connect();
        var room = [];
        var id_hotel = [];
        var prix_min = [];
        var boolchambre = true;
            //recuperation hotel de la ville
            const id_c = await client.db("aws").collection("Hotel").find({
                ville: obj.destination},{ projection: {ID_HOTEL: 1,_id:0}}).toArray();

            //boucle pou recuperer les chambres des hotels
            for(var i = 0; i < id_c.length; i++)
                {
                room[i] = await client.db("aws").collection("Chambre").find({ 
                id_hotel: id_c[i].ID_HOTEL},{projection :     
                {ID_CHAMBRE:1,_id:0}}).toArray();
                }
            //console.log(room)
            //boucle pour recuperer et tester les dates de reservation
            for(var i = 0; i<id_c.length; i++)
                {
                for(var j = 0; j < room[i].length; j++)
                    {
                    var date_arriv = await 
                    client.db("aws").collection("Chambre_dispo").find(
                        {id_chambre:room[i][j].ID_CHAMBRE},{projection : 
                    {date_deb:1,_id:0}}).toArray();
                    var date_depart = await 
                        client.db("aws").collection("Chambre_dispo").find(
                        {id_chambre:room[i][j].ID_CHAMBRE},{projection : 
                    {date_fin:1,_id:0}}).toArray();
                
                boolchambre = true;
                if(date_arriv.length == 0){
                    id_hotel[i] = await       
                    client.db("aws").collection("Chambre").find({
                    ID_CHAMBRE:room[i][j].ID_CHAMBRE},{projection :     
                        {id_hotel:1,_id:0}}).toArray();
                    break;
                }
                //boucle sur les dates d'une chambre
                
                for(var k = 0; k < date_arriv.length; k++)
                {
                    if(typeof date_arriv[k] === 'undefined')
                    {
                    console.log("Chambre disponible aucune reservation prevue, id:",room[i][j]);
                    id_hotel[i] = await       
                    client.db("aws").collection("Chambre").find({
                    ID_CHAMBRE:room[i][j].ID_CHAMBRE},{projection :     
                        {id_hotel:1,_id:0}}).toArray();
                    }
                    else
                    {
                        var date_arriver = new Date(date_arriv[k].date_deb);
                        var date_departt = new Date(date_depart[k].date_fin);
                        console.log(d_deb, d_fin);
                        var date_arriv_expected = new Date(d_deb);
                        var date_departt_expected = new Date(d_fin);
                        //verif des dates de reservation
                        if(date_arriv_expected.getTime() >= date_departt.getTime() ||
                        date_departt_expected.getTime() <= date_arriver.getTime())
                        {
                            console.log("chambre disponible, id: ", room[i][j]);
                        }
                        else
                        {
                            console.log("chambre non disponible (vraiment), id: ", 
                            room[i][j]);
                            boolchambre = false;
                        }
                        if(boolchambre == true)
                        {
                            id_hotel[i] = await 
                            client.db("aws").collection("Chambre").find({
                            ID_CHAMBRE:room[i][j].ID_CHAMBRE},{projection :     
                            {id_hotel:1,_id:0}}).toArray();
                        }
                    }
                }
            }
            }
            var nom_hotel = [];
            for(var i = 0; i < id_hotel.length; i++)
            {
                nom_hotel[i] = await client.db("aws").collection("Hotel").find({ 
                ID_HOTEL: id_hotel[i][0].id_hotel},{projection :     
                    {nom:1,ID_HOTEL:1,ville:1,prix:1,_id:1}}).toArray();
            }
  

            res.render('hotel',{date_deb: d_deb,date_fin: d_fin,data: nom_hotel});
            
        } catch (e) {
            console.error(e);
        } finally {
            client.close();
        }
      });

      module.exports = router;