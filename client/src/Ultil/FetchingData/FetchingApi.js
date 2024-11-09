import axios from 'axios';

const fetchingApiData = async (apiUrls) => {
    try {
        if (Array.isArray(apiUrls)) {
            const responses = await Promise.all(
                apiUrls.map(url => 
                    axios.get(url)
                        .then(response => {
                            if (response && response.data) {
                                return response.data;
                            } else {
                                console.error(`Invalid response for ${url}`);
                                return null;
                            }
                        })
                        .catch(error => {
                            console.error(`Error fetching ${url}:`, error);
                            return null; 
                        })
                )
            );
            return responses.filter(data => data !== null);
        } else if (typeof apiUrls === 'string') {
            const response = await axios.get(apiUrls);
            if (response && response.data) {
                return response.data;
            } else {
                throw new Error('Invalid response structure');
            }
        } else {
            throw new Error('Invalid apiUrls type: Expected string or array');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return empty array in case of error
    }
};

export default fetchingApiData;