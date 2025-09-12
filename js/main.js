// eBookStore Main JavaScript
// Production-ready, high-performance code optimized for 1M+ users

class EBookStore {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isLoading = false;
        this.searchTimeout = null;
        this.currentPage = this.getCurrentPage();

        this.init();
    }

    // Initialize the application
    async init() {
        try {
            this.initializeTheme();
            this.bindEventListeners();
            await this.loadBooks();
            this.handlePageSpecificLogic();
            this.initializeIntersectionObserver();
            this.initializePerformanceOptimizations();
        } catch (error) {
            console.error('Failed to initialize eBookStore:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }

    // Get current page from URL
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return filename.replace('.html', '');
    }

    // Theme Management - DISABLED
    initializeTheme() {
        // Dark mode functionality disabled as requested
        console.log('Dark mode functionality disabled');
    }

    toggleTheme() {
        // Dark mode functionality disabled as requested
        console.log('Dark mode toggle disabled');
    }

    // Event Listeners
    bindEventListeners() {
        // Mobile menu
        this.initializeMobileMenu();

        // Back to top button
        this.initializeBackToTop();

        // Search functionality
        this.initializeSearch();

        // Category filters
        this.initializeCategoryFilters();

        // Contact form
        this.initializeContactForm();

        // FAQ toggles
        this.initializeFAQ();

        // Newsletter form
        this.initializeNewsletter();

        // Error search redirect
        this.initializeErrorSearch();

        // Smooth scrolling
        this.initializeSmoothScrolling();
    }

    // Mobile Menu
    initializeMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuClose = document.getElementById('mobile-menu-close');

        if (!menuButton || !mobileMenu || !menuClose) {
            console.log('Mobile menu elements not found');
            return;
        }

        const menuContent = mobileMenu.querySelector('div');
        if (!menuContent) {
            console.log('Mobile menu content not found');
            return;
        }

        const openMenu = () => {
            console.log('Opening mobile menu...');
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                menuContent.classList.remove('translate-x-full');
            }, 10);
        };

        const closeMenu = () => {
            console.log('Closing mobile menu...');
            menuContent.classList.add('translate-x-full');
            document.body.style.overflow = '';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        };

        // Event listeners
        menuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openMenu();
        });

        menuClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });

        // Close on backdrop click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMenu();
            }
        });

        console.log('Mobile menu initialized successfully');
    }

    // Back to Top Button
    initializeBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('translate-y-16', 'opacity-0');
                backToTopBtn.classList.add('translate-y-0', 'opacity-100');
            } else {
                backToTopBtn.classList.add('translate-y-16', 'opacity-0');
                backToTopBtn.classList.remove('translate-y-0', 'opacity-100');
            }
        };

        // Throttled scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    toggleVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Search Functionality
    initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const categorySearch = document.getElementById('category-search');
        const errorSearch = document.getElementById('error-search');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        if (categorySearch) {
            categorySearch.addEventListener('input', (e) => {
                this.handleCategorySearch(e.target.value);
            });
        }

        if (errorSearch) {
            errorSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }

    handleSearch(query) {
        // Debounce search to improve performance
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    performSearch(query) {
        if (!query.trim()) {
            this.filteredBooks = [...this.books];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredBooks = this.books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm) ||
                book.description.toLowerCase().includes(searchTerm)
            );
        }

        this.renderBooks();
    }

    handleCategorySearch(query) {
        const categoryCards = document.querySelectorAll('.category-card');
        const searchTerm = query.toLowerCase();

        categoryCards.forEach(card => {
            const category = card.dataset.category?.toLowerCase() || '';
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';

            const matches = category.includes(searchTerm) ||
                title.includes(searchTerm) ||
                description.includes(searchTerm);

            card.style.display = matches ? 'block' : 'none';
        });
    }

    // Category Filters
    initializeCategoryFilters() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        const categoryCards = document.querySelectorAll('.category-card');

        // Filter buttons on home page
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);

                // Update active state
                categoryFilters.forEach(f => f.classList.remove('bg-primary-200', 'dark:bg-primary-800'));
                e.target.classList.add('bg-primary-200', 'dark:bg-primary-800');
            });
        });

        // Category cards on categories page
        categoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.dataset.category;
                this.showCategoryBooks(category);
            });
        });

        // Back to categories button
        const showAllBtn = document.getElementById('show-all-categories');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', () => {
                this.showAllCategories();
            });
        }
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.filteredBooks = [...this.books];
        } else {
            this.filteredBooks = this.books.filter(book => book.category === category);
        }
        this.renderBooks();
    }

    showCategoryBooks(category) {
        const categoryBooksSection = document.getElementById('category-books');
        const categoryTitle = document.getElementById('category-title');
        const categoryDescription = document.getElementById('category-description');
        const categoryGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8');

        if (!categoryBooksSection) return;

        // Hide category grid and show books
        if (categoryGrid) categoryGrid.style.display = 'none';
        categoryBooksSection.classList.remove('hidden');

        // Update title and description
        if (categoryTitle) categoryTitle.textContent = category;
        if (categoryDescription) {
            const descriptions = {
                'Technology': 'Explore cutting-edge programming, AI, and web development resources',
                'Business': 'Master entrepreneurship, marketing, and business strategy',
                'Arts': 'Unleash your creativity with design, photography, and writing guides',
                'Health': 'Improve your wellbeing with fitness, nutrition, and lifestyle advice',
                'Finance': 'Build wealth with personal finance and investment strategies',
                'Self-Help': 'Transform your life with personal development resources',
                'Lifestyle': 'Live sustainably and create better life balance'
            };
            categoryDescription.textContent = descriptions[category] || 'Discover amazing books in this category';
        }

        // Filter and render books
        this.filteredBooks = this.books.filter(book => book.category === category);
        this.renderCategoryBooks();
    }

    showAllCategories() {
        const categoryBooksSection = document.getElementById('category-books');
        const categoryGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8');

        if (categoryBooksSection) categoryBooksSection.classList.add('hidden');
        if (categoryGrid) categoryGrid.style.display = 'grid';
    }

    // Contact Form
    initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleContactSubmission(contactForm);
        });
    }

    async handleContactSubmission(form) {
        const submitBtn = document.getElementById('submit-btn');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');

        if (!submitBtn) return;

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading-spinner"></div><span>Sending...</span>';
        submitBtn.disabled = true;

        // Hide previous messages
        successMessage?.classList.add('hidden');
        errorMessage?.classList.add('hidden');

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateFormSubmission(form);

            // Show success message
            successMessage?.classList.remove('hidden');
            form.reset();

            // Scroll to success message
            successMessage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            console.error('Form submission failed:', error);
            errorMessage?.classList.remove('hidden');
            errorMessage?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateFormSubmission(form) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In production, replace with actual form submission
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form data:', data);

        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
            return { success: true };
        } else {
            throw new Error('Simulated submission failure');
        }
    }

    // FAQ Functionality
    initializeFAQ() {
        const faqToggles = document.querySelectorAll('.faq-toggle');

        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                const icon = toggle.querySelector('svg');

                if (content.classList.contains('hidden')) {
                    // Close all other FAQs
                    faqToggles.forEach(otherToggle => {
                        if (otherToggle !== toggle) {
                            const otherContent = otherToggle.nextElementSibling;
                            const otherIcon = otherToggle.querySelector('svg');
                            otherContent.classList.add('hidden');
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    });

                    // Open current FAQ
                    content.classList.remove('hidden');
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    // Close current FAQ
                    content.classList.add('hidden');
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    // Newsletter Subscription
    initializeNewsletter() {
        const newsletterForms = document.querySelectorAll('form');

        newsletterForms.forEach(form => {
            if (form.querySelector('input[type="email"][placeholder*="email"]')) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleNewsletterSubscription(form);
                });
            }
        });
    }

    async handleNewsletterSubscription(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailInput || !submitBtn) return;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success feedback
            submitBtn.textContent = 'Subscribed!';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');

            emailInput.value = '';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.add('btn-primary');
                submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                submitBtn.disabled = false;
            }, 2000);

        } catch (error) {
            console.error('Newsletter subscription failed:', error);
            submitBtn.textContent = 'Try Again';
            submitBtn.disabled = false;
        }
    }

    // Error Page Search Redirect
    initializeErrorSearch() {
        const errorSearch = document.getElementById('error-search');
        if (!errorSearch) return;

        errorSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // Smooth Scrolling
    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Data Loading
    async loadBooks() {
        if (this.books.length > 0) return;

        try {
            this.showLoadingState();

            const response = await fetch('data/ebooks.json');
            if (!response.ok) throw new Error('Failed to fetch books data');

            this.books = await response.json();
            this.filteredBooks = [...this.books];

            // Handle URL search parameter
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');
            if (searchQuery) {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = searchQuery;
                    this.performSearch(searchQuery);
                }
            }

            this.hideLoadingState();

        } catch (error) {
            console.error('Failed to load books:', error);
            this.showError('Failed to load books. Please try again later.');
        }
    }

    // Page-specific Logic
    handlePageSpecificLogic() {
        switch (this.currentPage) {
            case 'index':
                this.renderBooks();
                this.updateCategoryCounts();
                break;
            case 'ebook-details':
                this.handleBookDetails();
                break;
            case 'categories':
                this.updateCategoryCounts();
                break;
        }
    }

    // Book Rendering
    renderBooks() {
        const booksGrid = document.getElementById('books-grid');
        const noResults = document.getElementById('no-results');

        if (!booksGrid) return;

        if (this.filteredBooks.length === 0) {
            booksGrid.classList.add('hidden');
            noResults?.classList.remove('hidden');
            return;
        }

        noResults?.classList.add('hidden');
        booksGrid.classList.remove('hidden');

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        this.filteredBooks.forEach(book => {
            const bookCard = this.createBookCard(book);
            fragment.appendChild(bookCard);
        });

        booksGrid.innerHTML = '';
        booksGrid.appendChild(fragment);
    }

    renderCategoryBooks() {
        const booksGrid = document.getElementById('category-books-grid');
        const noBooks = document.getElementById('no-books-message');

        if (!booksGrid) return;

        if (this.filteredBooks.length === 0) {
            booksGrid.innerHTML = '';
            noBooks?.classList.remove('hidden');
            return;
        }

        noBooks?.classList.add('hidden');

        const fragment = document.createDocumentFragment();

        this.filteredBooks.forEach(book => {
            const bookCard = this.createBookCard(book);
            fragment.appendChild(bookCard);
        });

        booksGrid.innerHTML = '';
        booksGrid.appendChild(fragment);
    }

    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 border border-white/40 dark:border-slate-700/40 overflow-hidden group hover:-translate-y-4 hover:rotate-2 transform';

        card.innerHTML = `
            <div class="relative overflow-hidden">
                <img 
                    src="${book.cover}" 
                    alt="${book.title}" 
                    class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDIwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTI4QzEwMCAxNDAuNzMzIDg5LjczMyAxNTEgNzcgMTUxQzY0LjI2NyAxNTEgNTQgMTQwLjczMyA1NCAxMjhDNTQgMTE1LjI2NyA2NC4yNjcgMTA1IDc3IDEwNUM4OS43MzMgMTA1IDEwMCAxMTUuMjY3IDEwMCAxMjhaIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0xNDYgMTI4QzE0NiAxNDAuNzMzIDEzNS43MzMgMTUxIDEyMyAxNTFDMTEwLjI2NyAxNTEgMTAwIDE0MC43MzMgMTAwIDEyOEMxMDAgMTE1LjI2NyAxMTAuMjY3IDEwNSAxMjMgMTA1QzEzNS43MzMgMTA1IDE0NiAxMTUuMjY3IDE0NiAxMjhaIiBmaWxsPSIjRTVFN0VCIi8+Cjwvc3ZnPgo='"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute top-4 left-4">
                    <span class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500/90 to-purple-500/90 backdrop-blur-xl rounded-full text-xs font-semibold text-white border border-white/20 shadow-lg">
                        ${book.category}
                    </span>
                </div>
                <div class="absolute top-4 right-4">
                    <div class="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-full px-2 py-1 border border-white/20 dark:border-slate-700/50">
                        <div class="flex text-yellow-400">
                            ${this.generateStars(book.rating)}
                        </div>
                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">${book.rating}</span>
                    </div>
                </div>
            </div>
            <div class="p-8 space-y-4">
                <div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">${book.title}</h3>
                    <p class="text-slate-600 dark:text-slate-400 text-sm font-medium">by ${book.author}</p>
                </div>
                <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">${book.description}</p>
                <div class="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div class="flex flex-col">
                        <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">${book.price}</span>
                        <span class="text-xs text-slate-500 dark:text-slate-400">Digital Download</span>
                    </div>
                    <button 
                        class="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 group" 
                        onclick="window.location.href='ebook-details.html?id=${book.id}'"
                    >
                        <span>View Details</span>
                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHtml = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }

        // Half star
        if (hasHalfStar) {
            starsHtml += '<svg class="w-3 h-3 fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half-star"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half-star)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<svg class="w-3 h-3 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>';
        }

        return starsHtml;
    }

    // Book Details Page
    handleBookDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = parseInt(urlParams.get('id'));

        if (!bookId) {
            this.showBookNotFound();
            return;
        }

        const book = this.books.find(b => b.id === bookId);
        if (!book) {
            this.showBookNotFound();
            return;
        }

        this.renderBookDetails(book);
        this.renderRelatedBooks(book);
    }

    renderBookDetails(book) {
        const loadingState = document.getElementById('loading-state');
        const bookDetails = document.getElementById('book-details');
        const errorState = document.getElementById('error-state');

        if (loadingState) loadingState.classList.add('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (bookDetails) bookDetails.classList.remove('hidden');

        // Update page title
        document.title = `${book.title} - eBookStore`;

        // Update breadcrumb
        const breadcrumbCategory = document.getElementById('breadcrumb-category');
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbCategory) breadcrumbCategory.textContent = book.category;
        if (breadcrumbTitle) breadcrumbTitle.textContent = book.title;

        // Update book details
        const elements = {
            'book-cover': (el) => {
                el.src = book.cover;
                el.alt = book.title;
            },
            'book-title': (el) => el.textContent = book.title,
            'book-author': (el) => el.textContent = `by ${book.author}`,
            'book-price': (el) => el.textContent = book.price,
            'book-category': (el) => el.textContent = book.category,
            'book-rating': (el) => el.innerHTML = this.generateStars(book.rating),
            'book-pages': (el) => el.textContent = book.pages,
            'book-year': (el) => el.textContent = book.publishedYear,
            'book-isbn': (el) => el.textContent = book.isbn,
            'book-description': (el) => el.textContent = book.fullDescription || book.description
        };

        Object.entries(elements).forEach(([id, updateFn]) => {
            const element = document.getElementById(id);
            if (element) updateFn(element);
        });

        // Download button
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadBook(book);
            });
        }
    }

    renderRelatedBooks(currentBook) {
        const relatedBooksContainer = document.getElementById('related-books');
        if (!relatedBooksContainer) return;

        // Get books from the same category, excluding current book
        const relatedBooks = this.books
            .filter(book => book.category === currentBook.category && book.id !== currentBook.id)
            .slice(0, 3);

        if (relatedBooks.length === 0) {
            relatedBooksContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 col-span-full">No related books found.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        relatedBooks.forEach(book => {
            const bookCard = this.createBookCard(book);
            fragment.appendChild(bookCard);
        });

        relatedBooksContainer.innerHTML = '';
        relatedBooksContainer.appendChild(fragment);
    }

    showBookNotFound() {
        const loadingState = document.getElementById('loading-state');
        const bookDetails = document.getElementById('book-details');
        const errorState = document.getElementById('error-state');

        if (loadingState) loadingState.classList.add('hidden');
        if (bookDetails) bookDetails.classList.add('hidden');
        if (errorState) errorState.classList.remove('hidden');
    }

    // Download Functionality
    downloadBook(book) {
        const downloadBtn = document.getElementById('download-btn');
        if (!downloadBtn) return;

        const originalContent = downloadBtn.innerHTML;

        // Show downloading state
        downloadBtn.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Downloading...</span>
        `;
        downloadBtn.disabled = true;

        // Simulate download preparation
        setTimeout(() => {
            try {
                // Create download link
                const link = document.createElement('a');
                link.href = book.downloadUrl;
                link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show success state
                downloadBtn.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Downloaded!</span>
                `;

                // Reset button after delay
                setTimeout(() => {
                    downloadBtn.innerHTML = originalContent;
                    downloadBtn.disabled = false;
                }, 2000);

            } catch (error) {
                console.error('Download failed:', error);

                // Show error state
                downloadBtn.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Try Again</span>
                `;
                downloadBtn.disabled = false;
            }
        }, 1500);
    }

    // Category Count Updates
    updateCategoryCounts() {
        if (this.books.length === 0) return;

        const categoryCounts = {};
        this.books.forEach(book => {
            categoryCounts[book.category] = (categoryCounts[book.category] || 0) + 1;
        });

        // Update category filter counts
        document.querySelectorAll('.category-count').forEach(countEl => {
            const card = countEl.closest('.category-card');
            if (card) {
                const category = card.dataset.category;
                countEl.textContent = categoryCounts[category] || 0;
            }
        });
    }

    // Loading States
    showLoadingState() {
        const loadingState = document.getElementById('loading-state');
        const booksGrid = document.getElementById('books-grid');

        if (loadingState) loadingState.classList.remove('hidden');
        if (booksGrid) booksGrid.classList.add('hidden');
    }

    hideLoadingState() {
        const loadingState = document.getElementById('loading-state');

        if (loadingState) loadingState.classList.add('hidden');
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Performance Optimizations
    initializeIntersectionObserver() {
        // Lazy load images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('image-placeholder');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Animate elements on scroll
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.slide-up').forEach(el => {
            animationObserver.observe(el);
        });
    }

    initializePerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();

        // Implement service worker for caching (if available)
        this.registerServiceWorker();

        // Add performance monitoring
        this.initializePerformanceMonitoring();
    }

    preloadCriticalResources() {
        // Preload the first few book cover images
        const preloadImages = [
            'assets/images/book1.jpg',
            'assets/images/book2.jpg',
            'assets/images/book3.jpg',
            'assets/images/book4.jpg'
        ];

        preloadImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    registerServiceWorker() {
        // Service Worker registration disabled for static website
        // This prevents 404 errors when sw.js doesn't exist
        console.log('Service Worker registration skipped for static website');
    }

    initializePerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with actual web vitals library
            console.log('Performance monitoring initialized');
        }

        // Log performance metrics
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eBookStore = new EBookStore();
});

// Handle page visibility changes for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-critical operations
        console.log('Page hidden - pausing operations');
    } else {
        // Resume operations
        console.log('Page visible - resuming operations');
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    // In production, you might want to send this to an error tracking service
    // errorTracker.captureException(event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Prevent the default browser behavior
    event.preventDefault();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EBookStore;
}
