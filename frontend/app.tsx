import React from "react";
import { useApiGet, TApiResponse, TDrink } from "./utils";
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import { Tile } from "./tile";
import Modal from 'react-modal';
import { NewDrinkModal } from "./new_drink_modal";
import { DrinkModal } from "./drink_modal";

Modal.setAppElement('#root');

const App = () => {
    const response: TApiResponse = useApiGet('/drinks');
    
    const suggestions = response.data?.ingredients.map(ingredient => {
        return {
            id: ingredient,
            text: `${ingredient.substring(0,1).toUpperCase()}${ingredient.substring(1)}`
        } as Tag;
    })

    const [tags, setTags] = React.useState<Tag[]>([]);
    const handleDelete = (i: number) => {
        setTags(tags.filter((tag, index) => index !== i));
    };
    const handleAddition = (tag: Tag) => {
        setTags([tag, ...tags]);
    };
    const hasTag = (tagName: String) => {
        return !!tags.find(tag => tag.id.toLowerCase() === tagName.toLowerCase())
    };

    const [newDrinkModalOpen, setNewDrinkModalOpen] = React.useState(false);
    function openNewDrinkModal() {
        setNewDrinkModalOpen(true);
    };
    function closeNewDrinkModal() {
        setNewDrinkModalOpen(false);
        response.reload();
    };

    const [modalDrink, setModalDrink] = React.useState<TDrink>();
    const [drinkOverviewModalOpen, setDrinkOverviewModalOpen] = React.useState(false);
    function openDrinkOverviewModal(drink: TDrink) {
        setModalDrink(drink);
        setDrinkOverviewModalOpen(true);
    };
    function closeDrinkOverviewModal() {
        setDrinkOverviewModalOpen(false);
    };
    function getAvailableDrinks(): TDrink[] | undefined{
        if(!tags.length)
            return response.data?.drinks;
        return response.data?.drinks.filter(drink => {
            let requiredIngredients = drink.ingredients.filter(ingredient => ingredient.required);
            let hasIngredients = requiredIngredients.filter(ingredient => hasTag(ingredient.name));
            return requiredIngredients.length === hasIngredients.length;
        })
    }

    return  <>
        <NewDrinkModal isOpen={newDrinkModalOpen} closeModal={closeNewDrinkModal} onRequestClose={closeNewDrinkModal}/>
        <DrinkModal isOpen={drinkOverviewModalOpen} closeModal={closeDrinkOverviewModal} onRequestClose={closeDrinkOverviewModal} drink={modalDrink}/>
        <div className="container">
            <div className="tags">
                <ReactTags tags={tags} suggestions={suggestions} delimiters={[188, 13]} placeholder="Search for ingredients" handleDelete={handleDelete} handleAddition={handleAddition} autofocus={false}
                inputFieldPosition="top" allowDragDrop={false} minQueryLength={0} autocomplete/>
            </div>
            <div className="grid">
                {getAvailableDrinks()?.map((drink, idx) =>{return <Tile key={idx} {...drink} onClick={()=>{openDrinkOverviewModal(drink);}}/>})}
                <div className="tile button_add" onClick={openNewDrinkModal}><span>+</span></div>
            </div>
        </div>
    </>
};

export default App;