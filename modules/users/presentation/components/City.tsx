import { CitySelector } from "./CitySelector";

export default function City(){
    return(
        <div>
            <CitySelector onChange={city => console.log(city)}/>
        </div>
    )
}