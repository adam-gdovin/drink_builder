import React, { FunctionComponent, ReactElement, useState } from "react";
import Modal from 'react-modal';
import { TDrink } from "./utils";

interface CustomModaLProps extends Modal.Props{
    closeModal: Function,
    drink: TDrink | undefined
};

export const DrinkModal: FunctionComponent<CustomModaLProps> = (props : CustomModaLProps) => {

    if(!props.drink)
    return<></>
    return <Modal className="drink_modal" isOpen={props.isOpen}
        style={{content:{
            backgroundImage: props.drink.image ? `url("${props.drink.image}")` : "black"
        }}}
        onRequestClose={props.onRequestClose} 
        contentLabel={props.drink.name}>
            <div className="drink_modal_darken"></div>
            <div className="drink_modal_content">
                <h1>{props.drink.name}</h1>
                {props.drink.ingredients.map(ingredient => {
                    return <div className="drink_modal_ingredient_row">
                        <span className="ingredient_name">{ingredient.name}</span> - <span className="ingredient_amount">{ingredient.amount}</span> <span className="ingredient_unit">{ingredient.unit}</span>
                    </div>
                })}
                <p>
                    {props.drink.recipe}
                </p>
            </div>
        </Modal>
};