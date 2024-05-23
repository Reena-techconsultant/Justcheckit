import axios from 'axios';
import { BASE_URL } from './baseUrl';
import { retrieveData } from '../common/LocalStorage';

/* Posting Webservice Here */
export const postAPI = async (
  url,
  data,
  header = {},
  params = {},
  Authorization = {},
) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
  
    return axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
      params: params,
      Authorization: Authorization,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};


export const postCreate = async (url, data, header = {}) => {
  const connection = true;
  if (connection) {
    return axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers:{'Content-Type': 'application/json'},
    });
  } else {
    throw new Error('No Internet Connection');
  } 
};

// export const getAPI = async (url) => {
//   try {
//     const token = await retrieveData();
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Token ${token}`, 
//       },
//     });

//     return response;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error; 
//   }
// };

export const selectImage = async (url, data, header = {}) => {
  try {
    const token = await retrieveData();
    const response = await axios({
      method: 'post',
      url: url,
      timeout: 1000 * 60,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${token}`
      },
    });
  
    return response;
  } catch (error) {
    console.error('Error in selectImage:', error);
    throw error; // Rethrow the error to be caught by the calling function
  }
};

export const uploadImageAPI = async (url, data, authToken) => {
  const connection = true;
  if (connection) {
    try {
      const response = await axios({
        method: 'post',
        url: url,
        timeout: 1000 * 60, // Timeout of 60 Sec
        data: data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error('No Internet Connection');
  }
};


export const getAPI = async (url) => {
  try {
    const token = await retrieveData();
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`, 
      },
    });

    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
};







export const putAPI = async (url, data, header = {}) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'put',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};

export const deleteAPI = async (url, data, header = {}) => {
  /* Checking for Internet connection */
  const connection = true;
  /* If successfully connected */
  if (connection) {
    return axios({
      method: 'delete',
      url: url,
      timeout: 1000 * 60, //Time out of 60 Sec
      data: data,
      headers: header,
    });
  } else {
    /* throw error for No internet connection */
    throw new Error('No Internet Connection');
  }
};
