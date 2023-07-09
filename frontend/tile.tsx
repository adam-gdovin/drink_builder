import React, { FunctionComponent, MouseEventHandler } from "react";
import { TDrink } from "./utils";

interface CustomTileProps extends TDrink{
    onClick: MouseEventHandler
};
export const Tile: FunctionComponent<CustomTileProps> = (props : CustomTileProps) => {
    return <div onClick={props.onClick} className="tile drink" style={{"backgroundImage": props.image ? `url("${props.image}")` : `url("images/image_missing.png")`}}>
        <div className="fadeout"><span>{props.name}</span></div>
    </div>
};