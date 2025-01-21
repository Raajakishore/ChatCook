import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatBotScreen } from './ChatBotScreen';
import { View } from 'react-native';
import colors from './theme/colors';
import  Icon  from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export const  BottomNavigator = () : React.ReactNode => {
  return (
    <Tab.Navigator
          screenOptions={({ route }) => {
          return {
            headerShown: false,
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: { 
              backgroundColor: colors.tabbar,
              height: 64,
              paddingBottom: 10,
              borderColor: colors.primary
            },
          }}
        }
      >
        <Tab.Screen 
          name="ChatBot" 
          component={ChatBotScreen} 
          options={{
            tabBarActiveTintColor: colors.tertiary,
            tabBarInactiveTintColor: colors.grey,
            tabBarIcon: ({focused, color, size}) => {
              //@ts-ignore
              return <Icon  name='chat' size={27} color={focused ? colors.tertiary : colors.grey}/>
            }
          }}
        />
      </Tab.Navigator>
  );
}