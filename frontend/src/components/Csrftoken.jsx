import React,{useEffect} from 'react'
import axios from "axios"

const Csrftoken = () => {
    useEffect(() => {
        const fetchCsrfToken = async () => {
          try {
            await axios.get(import.meta.env.VITE_SERVER_URL + "/csrftoken/")
          } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
          }
        };
    
        fetchCsrfToken();
    }, []);
}

export default Csrftoken;