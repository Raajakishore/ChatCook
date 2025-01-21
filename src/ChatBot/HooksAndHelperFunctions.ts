import React from "react";
import Voice from '@react-native-voice/voice';
import { getRecipesfromSpoonacular } from "./axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ingredientsType, recipeInfo, recipeType, resultItemType } from "./types";

// Custom Hook Voice To Text
export const useVoiceToText = () => {
    const [isListening, setIsListening] = React.useState(false);
    const [result, setResult] = React.useState('');
    const startListening = async () => {
        try {
          setIsListening(true);
          setResult('');
         await  Voice.start('en-US', {
            RECOGNIZER_ENGINE: 'services',
            EXTRA_PARTIAL_RESULTS: true,
          })
        } catch (e) {
          Alert.alert(
            "Alert", 
            "Something went wrong. Please try again.", 
            [
              { text: "OK" }
            ]
          );
        }
      };
      const stopListening = async () => {
        try {
          setIsListening(false);
          await Voice.stop();
        } catch (e) {
          Alert.alert(
            "Alert", 
            "Something went wrong. Please try again.", 
            [
              { text: "OK" }
            ]
          );
        }
      };
      const onSpeechResults = (event : { value?: string[];}) => {
        if(event.value && event?.value[0]){
            setResult(event?.value[0]??"");
        }
      };
      React.useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = (e) => console.error('Speech Error:', e);
    
        return () => {
          Voice.destroy().then(Voice.removeAllListeners);
        };
      }, []);
    return {isListening, startListening, stopListening, result};
  };

  // Helper functions

  const setDataToLocalStorage = async (newData:resultItemType[])=>{
    try {
      await AsyncStorage.setItem('savedRecipes',JSON.stringify(newData)); 
    } catch (e) {
      console.log("error", e);
    }
  }

  export const getDateFromLocalstorage = async (setData:any)=>{
    try {
      const storedInPreviousSession = await AsyncStorage.getItem('savedRecipes');
      if(storedInPreviousSession){
        setData(JSON.parse(storedInPreviousSession));
      }

    } catch (e) {
      console.log("error", e);
    }
  }

export const getRecipes = async ( data : resultItemType[], setData: any, res:string, setLoading: any)=>{
    try{
        const response = await getRecipesfromSpoonacular(res);
        if(response.length>0){
          const recipeInfo : recipeInfo= {
            userQuery: res, 
            key: String(data.length+1),
            title: response[0]?.title?? "",
            ingredients : [],
            cookingInstructions: [] 
          }
    
          const recipe : recipeType= response[0];
          const steps = recipe?.analyzedInstructions[0]?.steps??[];
          recipeInfo.cookingInstructions = steps.map(x=>x?.step??"");
          recipeInfo.ingredients = recipe?.extendedIngredients.map((ingredient: ingredientsType)=>ingredient?.name??"");
          const newData = [...data , recipeInfo];
          setData(newData);
          setDataToLocalStorage(newData);
        } else{
          Alert.alert(
            "No Recipe found", 
            "Oops!.. Couldn't find the recipe you searched for", 
            [
              { text: "OK"}
            ]
          );
        }
    
        } catch(error){
          console.log("Error in fetching recipes", error);
        } finally{
          setLoading(false);
        }
      
}
