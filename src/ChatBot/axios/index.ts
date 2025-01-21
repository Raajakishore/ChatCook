import axios from 'axios';

export const mainAxios = axios.create({
  baseURL: 'https://api.spoonacular.com/'
});

export const getRecipesfromSpoonacular = async (query:string)=>{
    const {data : {results}} =  await mainAxios.get(`recipes/complexSearch`,{
        params: {
            query,
            apiKey: process.env.SPOONACULAR_API_KEY,
            fillIngredients: true,
            addRecipeInformation: true,
            addRecipeInstructions: true,
            number:1
        }
    })
    return results;
}
