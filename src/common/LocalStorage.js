import AsyncStorage from "@react-native-async-storage/async-storage";

export const retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      return value
    } else {

    
      return null
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }

};


export const retrieve_User_id = async () => {
  try {
    const value = await AsyncStorage.getItem('user_id');
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user_id:', error);
    throw error;
  }
};



