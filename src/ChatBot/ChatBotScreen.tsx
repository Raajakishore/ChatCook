import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from './theme/colors';
import { getDateFromLocalstorage, getRecipes, useVoiceToText } from './CustomHooks';
import { resultItemType } from './types';



const UserQueryItem = ({item} : {readonly item:resultItemType}) : React.ReactNode=>{
  return (
    <View style={styles.userQueryItemViewStyle}>
      <Text style={{color:colors.black}}>{item?.userQuery??""}</Text>
    </View>
  )
}

const ResultItem = ({item} : {item : resultItemType}) : React.ReactNode=>{

  return (
    <View style={styles.resultItemViewStyle}>
      <Text style={styles.titleStyle}>Recipe:</Text>
      <Text style={styles.labelStyle}>{item?.title??""}</Text>
      { item?.ingredients?.length>0 ?
      <>
        <Text style={styles.titleStyle}>Ingredients:</Text>
        {item.ingredients.map((ingredient, index)=>{
          return <Text style={styles.labelStyle}>{Number(index)+1}. {ingredient}</Text>})
        }
      </>
      :
      <Text style={styles.titleStyle}>Unfortunately, No ingredients were found.</Text>
    }
    { item?.ingredients?.length>0 ?
      <>
        <Text style={styles.titleStyle}>Cooking Instructions:</Text>
        {item.cookingInstructions.map((ins, index)=>{
          return <Text style={styles.labelStyle}>{Number(index)+1}. {ins}</Text>})
        }
      </>
      :
      <Text style={styles.titleStyle}>Unfortunately, No instructions were found.</Text>
      }
    </View>
  )
}

export const  ChatBotScreen = () :React.ReactNode=> {

  const [text, onChangeText] = React.useState('');

  // This data will hold the info about the recipes.
  const [data, setData ]= React.useState<resultItemType[]>([]);

  const [loading, setLoading] = React.useState(false);
  // Voice To Text Custom Hook Call
  const { isListening, startListening, stopListening, result: voiceToText }  = useVoiceToText();
                                                                           
  React.useEffect(()=>{

    // When the user searches through voice, the result(voiceToText) will invoke the getRecipes function.
    if(voiceToText){
      setLoading(true);
      getRecipes(data,setData,voiceToText,setLoading);
    }

  }, [voiceToText]);

  // When the user opens the app, the data from async storage will be fetched and stored in useState.
  React.useEffect(()=>{
    getDateFromLocalstorage(setData);
  },[]);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={ 'dark-content' }
        backgroundColor={styles.backgroundStyle.backgroundColor}
      />
      { loading &&
      <View style={styles.viewStyle}>
          <ActivityIndicator size = "large" color = {colors.tertiary} animating = { loading } />
      </View>
      }
      <Text style={styles.headerStyle}>ChatCook</Text>
      {
          data.length===0 ?
          <View style={ styles.getStartedViewStyle }>
              <Text style={styles.getStartedStyle}>Search for a recipe name to get started ;)</Text>
          </View>
        :
        <FlatList
          data={data}
          style={{flex:0.9}}
          renderItem={({index, item}) =>{
            return ( <>
                <UserQueryItem item={item} />
                <ResultItem item={item} />
              </>
            )
              }
          } 
          keyExtractor={item => item.key}
        />
      }     
      <View style={styles.bottomViewStyle}>
        <TouchableOpacity  onPress={isListening ? stopListening : startListening}>
              { //@ts-ignore *
              <Icon  name={isListening ? "mic-off" : "mic"  } color = {colors.tertiary} size={24}/>
              }
        </TouchableOpacity>
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            placeholder="Enter the recipe name here.."
            value={text}
          />
        <TouchableOpacity  onPress={()=>{
            setLoading(true);
            getRecipes(data, setData, text, setLoading); 
            onChangeText("");
        }}
          >
        { //@ts-ignore 
            <Icon  name={ "send"  } color = {colors.tertiary}  size={24}/>
        }
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        width:'80%'
      },
      text: {
        color: 'black',
      },
      box: {
        marginVertical: 20,
      },
      chatBoxStyle:{

      },
      titleStyle:{
        color:colors.black,
        fontSize:16,
        fontWeight:"bold"
      },
      labelStyle:{
        color:colors.black,
        marginLeft: 10,
        marginVertical: 4
      },
      getStartedStyle:{
        fontSize:24, 
        textAlign:'center', 
        color:colors.white
      },
      getStartedViewStyle:{
        flex:1, height:'100%',
        justifyContent:'center', 
        alignItems:'center'
      },
      bottomViewStyle:{
        height:50, 
        flexDirection:'row' ,
        justifyContent:'space-between', 
        alignItems:'center'
      },
      userQueryItemViewStyle:{
        alignSelf:'flex-end',
        width:'40%',
        backgroundColor:colors.white,
        padding:12,
        marginVertical:20,
        borderRadius:16
      },   
      resultItemViewStyle:{
        alignSelf:'flex-start',
        width:'70%',
        backgroundColor:colors.white,
        padding:12,
        borderRadius:16
      },
      backgroundStyle:{
        flex:1,
        padding:12,
        backgroundColor: colors.primary
      },
      viewStyle: {
        position:"absolute",
        zIndex:100,
        elevation: 100,
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
      },
      headerStyle:{
        fontSize:32, 
        textAlign:'center',
        color:colors.white
      }
});
