document.addEventListener('DOMContentLoaded', () => {
    const wishlist = document.getElementById('wishlist');
    const itemInput = document.getElementById('itemInput');
    const addItemBtn = document.getElementById('addItemBtn');

    // Load existing wishlist items from local storage
    function loadWishlist() {
        const savedItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
        savedItems.forEach(item => addItemToDOM(item));
    }

    // Save wishlist items to local storage
    function saveWishlist(items) {
        localStorage.setItem('wishlistItems', JSON.stringify(items));
    }

    // Add an item to the DOM
    function addItemToDOM(itemText) {
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.textContent = itemText;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            wishlist.removeChild(li);
            updateSavedItems();
        });
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        wishlist.appendChild(li);
    }

    // Update saved items in local storage
    function updateSavedItems() {
        const items = Array.from(wishlist.children).map(li => li.querySelector('span').textContent);
        saveWishlist(items);
    }

    // Add new item
    addItemBtn.addEventListener('click', () => {
        const itemText = itemInput.value.trim();
        if (itemText) {
            addItemToDOM(itemText);
            itemInput.value = '';
            updateSavedItems();
        }
    });

    // Allow adding item with Enter key
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItemBtn.click();
        }
    });

    // Load existing wishlist on page load
    loadWishlist();
});