const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// mongoose import
const mongoose = require('mongoose');

const uri = "mongodb+srv://vinit:vinit123@cluster0.orohzmx.mongodb.net/ToDo?retryWrites=true&w=majority";

mongoose.set('strictQuery', false);
// database connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    });


// create table/schema
const items = mongoose.Schema({
    itemName: { type: String },
})
// wrraped schema in model
const itemModel = mongoose.model("items", items);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get('/', (req, res) => {
    
   
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
        itemModel.find({})
        .then((all_driver_details) => {
            console.log("++++++++ All employees from mongoDB ++++++++++");
            console.log(all_driver_details);
    var day = today.toLocaleDateString("en-US", options);

            res.render('list', { listTitle: day, newListItems: all_driver_details });

        })
        .catch((error) => {
            console.log(error);
        });

});


app.post('/', async (req, res) => {
    console.log(req.body.newItem);

    try {
        const userData_inserted = await itemModel.create({ itemName: req.body.newItem });
        console.log("*** data added successfully to DB***");
        console.log(userData_inserted);
        res.redirect("/");
    } catch (error) {
        console.log("---Sorry data is not added to DB due to error Below -----");
        console.log(error);
        res.redirect("/");
    }
});

app.get('/delete/:id', async (req, res) => {
    const id_from_delete_button = req.params.id;
    itemModel.findByIdAndDelete(id_from_delete_button)
      .then(userdetails => {
        console.log("@@@@@@@@@@@@ Employee Deleted From DB Using findByIDAndDelete @@@@@@@@@@@@");
        console.log(userdetails);
        res.redirect("/");
      })
      .catch(error => {
        console.log(error);
      });
});



app.listen(3000, function () {
    console.log("Server started on port 3000");
});