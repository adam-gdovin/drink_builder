import {Schema, model, connect} from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export interface IIngredient {
    name: String;
    unit: String;
    amount: Number,
    required: Boolean
};

export interface IDrink {
    name: String;
    image: String;
    recipe: String;
    ingredients: IIngredient[];
};

const IngredientSchema = new Schema<IIngredient>({
    name: {type: String, required: true},
    unit: {type: String, required: true},
    amount: {type: Number, required: true},
    required: {type: Boolean, default: true}
});

const DrinkSchema = new Schema<IDrink>({
    name: {type: String, required: true},
    recipe: {type: String, required: false},
    image: {type: String, required: false},
    ingredients: {type: [IngredientSchema], required: true},
});

export const DrinkModel = model("drinks", DrinkSchema);

export function connectDB(){
    const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_ADDRESS}/${process.env.DB_DATABASE}?authMechanism=DEFAULT&authSource=${process.env.DB_AUTHSOURCE}`;
    console.log(url)
    return connect(url, {autoIndex: false});
};