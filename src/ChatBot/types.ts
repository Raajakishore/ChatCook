
export interface resultItemType {
    userQuery : string;
    key: string;
    title : string;
    ingredients : string[];
    cookingInstructions : string[];
}

export interface stepType 
    {
        step: string
    }

export interface ingredientsType  {
    name:string;
}
export interface recipeType {
    analyzedInstructions:[{
        steps : stepType[]
    }]
    extendedIngredients:ingredientsType[];
};

export interface recipeInfo {
        userQuery: string, 
        key: string,
        title: string,
        ingredients : string[],
        cookingInstructions: string[] 
    
}