const form = document.querySelector('#searchForm');
const docTest = document.querySelector('#movies');



form.addEventListener('submit', async (e) => {
    e.preventDefault();
    

    const cards = document.querySelectorAll('.card');
    for (let card of cards) {
        card.remove();
    }
    
    const errorDiv = document.querySelector('#error-message');
    if (errorDiv) errorDiv.remove();
    
    try {
        const result = await sendRequest();
        console.log('API Response:', result.data);
        showResults(result);
    } catch (error) {
        console.error('Search failed:', error);
        showError(error.response?.data?.message || error.message || 'Search failed. Please try again.');
    }
})

const sendRequest = async () => {
    try {
        let searchTerm = form.elements.query.value.trim();
        if (!searchTerm) {
            throw new Error('Please enter a search term');
        }
        
        const config = { 
            headers: { 
                'x-rapidapi-key': '<Add Your API Key>',
                'x-rapidapi-host': 'imdb8.p.rapidapi.com'
            }
        };
        
        const result = await axios.get(`https://imdb8.p.rapidapi.com/auto-complete?q=${encodeURIComponent(searchTerm)}`, config);
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const showResults = (result) => {
    try {
        const errorDiv = document.querySelector('#error-message');
        if (errorDiv) errorDiv.remove();
        
        if (!result.data || !result.data.d || result.data.d.length === 0) {
            showError('No results found. Try a different search term.');
            return;
        }
        
        var movies = result.data.d;
        for (res of movies) {
            if (!res.i || !res.i.imageUrl) {
                continue;
            }
            
            let divOut = document.createElement('div');
            divOut.classList.add('col-md-3', 'text-center', 'mt-3');
    
            let divCart = document.createElement('div');
            divCart.classList.add('card', 'mt-3');
    
            divOut.append(divCart);
    
            let cardImage = document.createElement('img');
            cardImage.classList.add('p-1', 'rounded', 'img-fluid');
            cardImage.src = res.i.imageUrl; 
            cardImage.alt = res.l || 'Movie poster';
    
            let h5 = document.createElement('h5');
            h5.classList.add('mt-3', 'card-title');
            h5.textContent = res.l || 'Unknown Title'; 
            
            if (res.y) {
                let yearSpan = document.createElement('span');
                yearSpan.classList.add('text-muted', 'd-block', 'small');
                yearSpan.textContent = `(${res.y})`;
                h5.appendChild(yearSpan);
            }
    
            divCart.appendChild(cardImage);
            divCart.appendChild(h5);
    
            divOut.appendChild(divCart);
    
            docTest.appendChild(divOut);
        }
    } catch (error) {
        console.error('Error displaying results:', error);
        showError('Error displaying search results.');
    }
}

const showError = (message) => {
    const container = document.querySelector('.container');
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.classList.add('alert', 'alert-danger', 'mt-3');
    errorDiv.textContent = message;
    
    const searchContainer = container.querySelector('.row');
    searchContainer.parentNode.insertBefore(errorDiv, searchContainer.nextSibling);
};
