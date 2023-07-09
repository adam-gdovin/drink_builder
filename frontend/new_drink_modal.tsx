import React, { FunctionComponent, ReactElement, useState } from "react";
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Modal from 'react-modal';

const IngredientRow: FunctionComponent<{deleteRow: Function}> = (props: {deleteRow: Function}) => {
    return <div className="new_drink_input_row new_drink_input_ingredient_row">
        <input placeholder="Ingredient" className="new_drink_input_ingredient_name" name="ingredientName"></input>
        <input placeholder="Amount" className="new_drink_input_ingredient_amount" name="ingredientAmount"></input>
        <input placeholder="Unit" className="new_drink_input_ingredient_unit" name="ingredientUnit"></input>
        <input type="checkbox" className="new_drink_input_ingredient_required" name="ingredientRequired" defaultChecked={true} title="Required?"></input>
        <button type="button" className="new_drink_input_ingredient_remove" onClick={() => {props.deleteRow();}}>X</button>
    </div>
}

interface CustomModaLProps extends Modal.Props{
    closeModal: Function
};

const inputRowMap = new Map<number, ReactElement>();
export const NewDrinkModal: FunctionComponent<CustomModaLProps> = (props : CustomModaLProps) => {

    const [ingredients, setIngredients] = useState<ReactElement[]>([]);
    const [images, setImages] = useState<ImageListType>([]);
    const [stage, setStage] = useState<any[]>([]);

    function deleteRow(id : number){
        inputRowMap.delete(id);
        setIngredients([...inputRowMap.values()]);
    }

    function reset(){
        setStage([]);
        inputRowMap.clear();
        let id = Date.now();
        inputRowMap.set(id, <IngredientRow key={id} deleteRow={() => {deleteRow(id);}}/>);
        setIngredients([...inputRowMap.values()]);
        setImages([]);
    }

    function onImageChange(imagesList: ImageListType){
        setImages(imagesList);
        validateImage(imagesList);
    }

    function validateDrinkName(){
        let elem = document.querySelector(".new_drink_input_name") as HTMLInputElement;
        if(!elem || !elem.value || !elem.value.length)
            return showError("Drink name can't be empty!");
        setStage([elem.value])
        hideError();
    }
    function validateImage(imagesList: ImageListType | null){
        if(!imagesList){
            if(!images.length)
                return showError("You need to upload an image!");
            setStage([...stage, images[0]]);
            hideError();
        }else if(imagesList.length){
            setStage([...stage, imagesList[0]]);
            hideError();
        }
    }
    function validateIngredients(){
        let formEl = (document.forms as any).IngredientsForm;
        let formData = new FormData(formEl);
        let ingredientNames = formData.getAll("ingredientName");
        let ingredientUnits = formData.getAll("ingredientUnit");
        let ingredientAmounts = formData.getAll("ingredientAmount");
        let ingredientReq = formData.getAll("ingredientRequired");
        let ingredients = ingredientNames.filter(name => name.length).map((_,idx) => {
            return {name: ingredientNames[idx], unit: ingredientUnits[idx], amount: ingredientAmounts[idx], required: ingredientReq[idx] === "on"};
        });
        if(!ingredients || !ingredients.length)
            return showError("Ingredients list can't be empty!");
        setStage([...stage, ingredients]);
        hideError();
    }

    async function submit(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>){
        let elem = document.querySelector(".new_drink_input_recipe") as HTMLInputElement;
        let recipe = elem?.value;

        let postFormData = new FormData();
        postFormData.append("drink", JSON.stringify({
           name: stage[0] as string,
           ingredients: stage[2],
           recipe: recipe
        }));
        postFormData.append("image", images[0].file as Blob);
        
        fetch("/create", {
            method: 'POST',
            body: postFormData
        }).then(() => {
            props.closeModal();
        })
        .catch(er => {
            console.log(er);
        });
    }

    function showError(text: string){
        let errorDiv = document.getElementById("new_drink_error") as HTMLDivElement;
        if(!errorDiv)
            return;
        errorDiv.innerHTML = `<span>${text}</span>`;
        errorDiv.style.visibility = "visible";
    }
    function hideError(){
        let errorDiv = document.getElementById("new_drink_error") as HTMLDivElement;
        if(!errorDiv)
            return;
        errorDiv.style.visibility = "hidden";
    }

    function getStageContent(stageLength: number){
        switch(stageLength){
            case 0:
                return (<>
                    <div className="new_drink_input_form">
                        <div className="new_drink_input_row">
                            <input className="new_drink_input_name" placeholder="Drink name" name="drinkName" type="text"/>
                        </div>
                    </div>
                    <div className="new_drink_input_stage_buttons">
                        <button className="new_drink_input_next" type="button" onClick={() => {validateDrinkName();}}>Next</button>
                    </div>
                </>)
            case 1:
                return (<>
                    <div className="new_drink_input_form">
                        <h1>{stage[0]}</h1>
                        <ImageUploading value={images} maxNumber={1} onChange={onImageChange}>
                            {({onImageUpload}) => (
                                <div className="new_drink_input_row new_drink_input_image_row">
                                    <div className="new_drink_input_image" onClick={onImageUpload} style={{visibility: images.length ? "hidden" : "visible"}}><span>Upload Photo</span></div>
                                </div>
                            )}
                        </ImageUploading>
                    </div>
                    <div className="new_drink_input_stage_buttons">
                        <button className="new_drink_input_back" type="button" onClick={() => {setStage(stage.slice(0, -1)); setImages([])}}>Back</button>
                        <button className="new_drink_input_next" type="button" onClick={() => {validateImage(null);}}>Next</button>
                    </div>
                </>)
            case 2:
                return (<>
                    <div className="new_drink_input_form">
                        <h1>{stage[0]}</h1>
                        <form action="" method="post" id="IngredientsForm">
                            {ingredients}
                            <div className="new_drink_input_row">
                                <button type="button" className="new_drink_input_ingredient_add" onClick={() => {
                                    let id = Date.now();
                                    inputRowMap.set(id, <IngredientRow key={id} deleteRow={() => {deleteRow(id);}}/>);
                                    setIngredients([...inputRowMap.values()]);
                                }}>+</button>
                            </div>
                        </form>
                    </div>
                    <div className="new_drink_input_stage_buttons">
                        <button className="new_drink_input_back" type="button" onClick={() => {setStage(stage.slice(0, -1)); setImages([])}}>Back</button>
                        <button className="new_drink_input_next" type="button" onClick={() => {validateIngredients();}}>Next</button>
                    </div>
                </>)
            case 3:
                return (<>
                    <div className="new_drink_input_form">
                        <div className="new_drink_input_row">
                            <textarea className="new_drink_input_recipe" placeholder="Recipe" name="drinkRecipe" style={{"resize": "none"}}/>
                        </div>
                    </div>
                    <div className="new_drink_input_stage_buttons">
                        <button className="new_drink_input_next" type="button" onClick={submit}>Submit</button>
                    </div>
                </>)

        }
    }

    return <Modal className="new_drink_modal" isOpen={props.isOpen}
        style={{content:{
            backgroundImage: images.length ? `url("${images[0].dataURL}")` : "black"
        }}}
        onAfterOpen={() => {reset();}} 
        onRequestClose={props.onRequestClose} 
        contentLabel="New Drink">
            <div className="new_drink_image_fade"/>
            {getStageContent(stage.length)}
            <div id="new_drink_error"></div>
        </Modal>
};