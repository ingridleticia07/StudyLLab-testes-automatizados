function initializeSearchBar() {
    const searchInput = document.querySelector('.search-bar input[type="search"]');
    const searchButton = document.querySelector('.search-bar button');

    if (searchInput && searchButton) {
        searchInput.addEventListener('input', function() {
            searchButton.style.display = this.value.length > 0 ? 'none' : 'block';
        });

        searchInput.addEventListener('blur', function() {
            if (this.value.length === 0) {
                searchButton.style.display = 'block';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeSearchBar);
