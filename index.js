const PORT = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


//const date = require(__dirname + "/date.js");

const app = express();

// mongoose.connect("mongodb+srv://chetan:shaolin@1@cluster0.t7uvr.gcp.mongodb.net/todo", {useNewUrlParser:true});

const uri = "mongodb+srv://ctk12:shaolinTEMPLE@cluster0.t7uvr.gcp.mongodb.net/"  + "todo?retryWrites=true&w=majority";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const todoSchema ={
    name:String
};

const List = mongoose.model("List", todoSchema);

const item1 = new List ({
name:"Hey nice 1"
});

const item2 = new List ({
    name:"Hey nice 2"
    });

    const item3 = new List ({
        name:"Hey nice 3"
        });

        const allItems = [item1, item2, item3];

//         // List.insertMany(allItems, function(err){
//         //     if(err){
//         //         console.log(err);
//         //     }else{
//         //         console.log("Hey Inserted sucessfully!");
//         //     }
//         // });

//         const nextSchema = {
//             name:String,
//             items:[todoSchema]
//         };

//         const Item = mongoose.model("Item", nextSchema);

       

var items = ["hey1","hey2","hey3"];

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");



app.get("/", function(req, res){
//res.send("Hi Hello World!");
  // const day = date.getDate();

  List.find({}, function(err, found){

    if(found.length === 0){

        List.insertMany(allItems, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Hey Inserted sucessfully!");
            }
        });
        res.redirect("/");
       
    }else{
        res.render("lists", {title:"today", newListItems:found});
    }

   
  })

   
});

app.post("/", function(req, res){
     
    const itemName = req.body.itemName;
    const listName = req.body.list;

    const item = new List ({
         name:itemName
    });

    if(listName === "today"){
        item.save();
        res.redirect("/");
      }else{
          Item.findOne({name:listName}, function(err, foundList){
              foundList.items.push(item);
              foundList.save();
              res.redirect("/" + listName);
          })
      }

});

app.post("/delete", function(req, res){
     const checkedItem = req.body.checkbox;
     const listName = req.body.listName;

     if(listName === "today"){

        List.findByIdAndRemove(checkedItem, function(err){
            if(!err){
                console.log("Removed checked Item");
                res.redirect("/");
            }
        });

     }else{

        Item.findOneAndUpdate({name:listName}, {$pull: {items: {_id:checkedItem}}}, function(err, foundItm){
             
            if(!err){
                      res.redirect("/" + listName);
            }
        });
     }

});

app.get("/:customListName", function(req, res){
       const customListName = _.capitalize(req.params.customListName);

       Item.findOne({name:customListName}, function(err, foundItm){

            if(!err){
                if(!foundItm){
                    // console.log("doesn't Exits");
                    const itm = new Item({
                        name:customListName,
                        items:allItems
                   });
            
                   itm.save();
                   res.redirect("/" + customListName);

                }else{
                    // console.log("Exits");
                    res.render("lists", {title:foundItm.name, newListItems:foundItm.items});
                }
            }
       });

      
});

app.listen(PORT, function(){
    console.log("Connected Server");
});
