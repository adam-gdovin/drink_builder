import express from "express";
import path from "path";
import fileUpload, { FileArray, UploadedFile } from "express-fileupload";
import { DrinkModel, connectDB, IDrink} from "./db";

const dbConnection = connectDB().catch(console.log);
const app = express();
app.use(express.json());
app.use(fileUpload());
app.use("/", express.static(path.resolve(__dirname, "public")));
app.get("/drinks", async (req, res) => {
    let drinks = await DrinkModel.find();
    res.send({
        ingredients: drinks.map(drink => drink.ingredients).flat().map((ingredient) => ingredient.name.toLowerCase()).filter((name, idx, arr) => arr.indexOf(name) === idx),
        drinks,
    });
});

app.post("/create", async(req, res) => {
    if(!req.body)
        return res.sendStatus(400);
    let drink = JSON.parse(req.body.drink) as IDrink;
    if(!drink)
        return res.sendStatus(400);
    if(!drink.name)
        return res.status(400).send("Missing drink name.");
    if(!drink.ingredients || !(drink.ingredients instanceof Array) || !drink.ingredients.length)
        return res.status(400).send("Missing drink ingredients.");

    const image = (req.files as fileUpload.FileArray).image as fileUpload.UploadedFile;
    if (!image) 
        return res.status(400).send("Missing image file.");

    if (!/^image/.test(image.mimetype)) 
        return res.status(400).send("Incorrect image file format.");

    let imagePath = `images/${image.name}`;
    await image.mv(`${__dirname}/public/${imagePath}`);

    drink.image = imagePath;
    await DrinkModel.create(drink);
    res.send(drink);
});
app.listen(process.env.PORT);