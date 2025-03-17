document.addEventListener('DOMContentLoaded', function() {
    // Product folder paths
    const productFolders = [
        "Mens-Coat&Jacket",
        "Ladies-Coat",
        "Ladies-Jacket",
        "Mens-Wind-Jacket",
        "Ladies-wind-Coat",
        "straw-hats",
        "Mens-SOCKS",
        "scarves-foulards"
    ];

    // Product category names in English
    const categoryNames = {
        "Mens-Coat&Jacket": "Men's Coat & Jacket",
        "Ladies-Coat": "Ladies' Coat",
        "Ladies-Jacket": "Ladies' Jacket",
        "Mens-Wind-Jacket": "Men's Wind Jacket",
        "Ladies-wind-Coat": "Ladies' Wind Coat",
        "straw-hats": "Straw Hats",
        "Mens-SOCKS": "Men's Socks",
        "scarves-foulards": "Scarves & Foulards"
    };

    // Product season information
    const productSeasons = {
        "Mens-Coat&Jacket": "Fall/Winter",
        "Ladies-Coat": "Fall/Winter",
        "Ladies-Jacket": "Fall/Winter",
        "Mens-Wind-Jacket": "Spring/Fall",
        "Ladies-wind-Coat": "Spring/Fall",
        "straw-hats": "Spring/Summer",
        "Mens-SOCKS": "All Seasons",
        "scarves-foulards": "Fall/Winter"
    };

    // Product material information
    const productMaterials = {
        "Mens-Coat&Jacket": "Wool, Cotton, Polyester",
        "Ladies-Coat": "Wool, Cotton, Polyester",
        "Ladies-Jacket": "Wool, Cotton, Polyester",
        "Mens-Wind-Jacket": "Nylon, Polyester",
        "Ladies-wind-Coat": "Nylon, Polyester",
        "straw-hats": "Natural Straw, Paper Straw",
        "Mens-SOCKS": "Cotton, Polyester, Nylon",
        "scarves-foulards": "Silk, Cotton, Wool"
    };

    // Product style information
    const productStyles = {
        "Mens-Coat&Jacket": "Business Casual, Urban Fashion",
        "Ladies-Coat": "Elegant Fashion, Modern Minimalist",
        "Ladies-Jacket": "Fashion Casual, Urban Trend",
        "Mens-Wind-Jacket": "Sports Casual, Outdoor Style",
        "Ladies-wind-Coat": "Light Fashion, Urban Casual",
        "straw-hats": "Natural Casual, Vacation Style",
        "Mens-SOCKS": "Business Casual, Sports Style",
        "scarves-foulards": "Elegant Fashion, Classic Plaid"
    };

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // If there's a category parameter in the URL, activate the corresponding tab
    if (categoryParam && document.querySelector(`.category-tab[data-category="${categoryParam}"]`)) {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.category-tab[data-category="${categoryParam}"]`).classList.add('active');
    }

    // Load products
    loadProducts(categoryParam || 'all');

    // Tab switching event
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            
            // Load products for the corresponding category
            loadProducts(category);
            
            // Update URL parameters without refreshing the page
            const url = new URL(window.location);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);
        });
    });

    // Function to load products
    function loadProducts(category) {
        const productGallery = document.querySelector('.product-gallery');
        productGallery.innerHTML = ''; // Clear existing products
        
        // Determine which folders to load
        let foldersToLoad = [];
        if (category === 'all') {
            foldersToLoad = productFolders;
        } else {
            foldersToLoad = [category];
        }
        
        // Load products for each folder
        foldersToLoad.forEach(folder => {
            // Create category title
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'product-category-title';
            categoryTitle.setAttribute('data-category', folder);
            
            // Set category title based on current language
            if (categoryTranslations[currentLanguage] && categoryTranslations[currentLanguage][folder]) {
                categoryTitle.textContent = categoryTranslations[currentLanguage][folder];
            } else {
                categoryTitle.textContent = folder;
            }
            
            productGallery.appendChild(categoryTitle);
            
            // Create product container
            const productContainer = document.createElement('div');
            productContainer.className = 'product-container';
            productGallery.appendChild(productContainer);
            
            // Load product images (assuming each category has at most 12 product images)
            for (let i = 1; i <= 12; i++) {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.setAttribute('data-category', folder);
                productItem.setAttribute('data-product-id', i);
                
                const productImage = document.createElement('img');
                productImage.src = `images/product/${folder}/${i}.png`;
                
                // Set alt text based on current language
                if (categoryTranslations[currentLanguage] && categoryTranslations[currentLanguage][folder]) {
                    productImage.alt = `${categoryTranslations[currentLanguage][folder]} ${i}`;
                } else {
                    productImage.alt = `${folder} ${i}`;
                }
                
                // Handle image loading errors
                productImage.onerror = function() {
                    productItem.remove(); // If the image doesn't exist, remove the product item
                };
                
                // Product click event - open detail modal
                productItem.addEventListener('click', function() {
                    openProductDetail(folder, i);
                });
                
                productItem.appendChild(productImage);
                
                const productName = document.createElement('h3');
                
                // Set product name based on current language
                if (categoryTranslations[currentLanguage] && categoryTranslations[currentLanguage][folder]) {
                    productName.textContent = `${categoryTranslations[currentLanguage][folder]} - No.${i}`;
                } else {
                    productName.textContent = `${folder} - No.${i}`;
                }
                
                productItem.appendChild(productName);
                
                productContainer.appendChild(productItem);
            }
        });
    }

    // Open product detail modal
    function openProductDetail(category, productId) {
        const modal = document.querySelector('.product-detail-modal');
        const modalImage = modal.querySelector('.product-detail-image img');
        const modalTitle = modal.querySelector('.product-detail-title');
        const modalMaterial = modal.querySelector('.product-material');
        const modalStyle = modal.querySelector('.product-style');
        const modalSeason = modal.querySelector('.product-season');
        
        // Set modal content
        modalImage.src = `images/product/${category}/${productId}.png`;
        
        // Set title based on current language
        if (categoryTranslations[currentLanguage] && categoryTranslations[currentLanguage][category]) {
            modalTitle.textContent = `${categoryTranslations[currentLanguage][category]} - No.${productId}`;
        } else {
            modalTitle.textContent = `${category} - No.${productId}`;
        }
        
        // Set material based on current language
        const material = productMaterials[category] || 'Premium Fabric';
        if (materialTranslations[currentLanguage] && materialTranslations[currentLanguage][material]) {
            modalMaterial.textContent = materialTranslations[currentLanguage][material];
        } else {
            modalMaterial.textContent = material;
        }
        
        // Set style based on current language
        const style = productStyles[category] || 'Modern Fashion';
        if (styleTranslations[currentLanguage] && styleTranslations[currentLanguage][style]) {
            modalStyle.textContent = styleTranslations[currentLanguage][style];
        } else {
            modalStyle.textContent = style;
        }
        
        // Set season based on current language
        const season = productSeasons[category] || 'All Seasons';
        if (seasonTranslations[currentLanguage] && seasonTranslations[currentLanguage][season]) {
            modalSeason.textContent = seasonTranslations[currentLanguage][season];
        } else {
            modalSeason.textContent = season;
        }
        
        // Show modal
        modal.style.display = 'flex';
    }

    // Close modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.querySelector('.product-detail-modal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.querySelector('.product-detail-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
}); 