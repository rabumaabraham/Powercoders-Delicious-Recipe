/*=============== SHOW MENU LOGIC ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLinks = document.querySelectorAll('.nav__link');
const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav_link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
};
navLinks.forEach(n => n.addEventListener('click', linkAction));

/*=============== ADD BLUR HEADER ===============*/
const blurHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
};
window.addEventListener('scroll', blurHeader);



/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    window.scrollY >= 350 ? scrollUp.classList.add('show-scroll') : scrollUp.classList.remove('show-scroll');
};
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionLink.classList.add('active-link');
        } else {
            sectionLink.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // Reset: true // animations repeat
});
sr.reveal('.home_data, .contact__container');
sr.reveal('.home_img', { delay: 600 });
sr.reveal('.home_scroll', { delay: 800 });
sr.reveal('.recipe_card', { interval: 100 });

// === SCROLL ANIMATIONS FOR ALL MAJOR SECTIONS ===
sr.reveal('.home-hero-content', { origin: 'bottom', distance: '40px', delay: 200 });
sr.reveal('.restaurant-menu-grid', { origin: 'top', distance: '60px', delay: 200 });
sr.reveal('.menu-category', { origin: 'bottom', distance: '40px', interval: 200, delay: 400 });
sr.reveal('.meal-section .container', { origin: 'top', distance: '60px', delay: 200 });
sr.reveal('.meal-form', { origin: 'left', distance: '40px', delay: 400 });
sr.reveal('.meal-suggestion-result', { origin: 'right', distance: '40px', delay: 600 });
sr.reveal('.booking-section .container', { origin: 'top', distance: '60px', delay: 200 });
sr.reveal('.booking-box', { origin: 'bottom', distance: '40px', delay: 400 });
sr.reveal('.testimonies-section .container', { origin: 'top', distance: '60px', delay: 200 });
sr.reveal('.testimonies-grid', { origin: 'bottom', distance: '40px', delay: 400 });
sr.reveal('.testimony-card', { origin: 'left', distance: '40px', interval: 200, delay: 600 });
sr.reveal('.contact.section .container', { origin: 'top', distance: '60px', delay: 200 });
sr.reveal('.contact-box', { origin: 'bottom', distance: '40px', delay: 400 });
sr.reveal('.footer__container', { origin: 'top', distance: '40px', delay: 200 });





//// api 
const apiBaseUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            fetchMeals(category);
        });
    });
});

async function fetchMeals(category) {
    const response = await fetch(apiBaseUrl + category);
    const data = await response.json();
    displayMeals(data.meals);
}

async function getMealDetails(mealId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    return data.meals[0]; 
}

async function displayMeals(meals) {
    const mealCards = document.getElementById('meal-cards');
    mealCards.innerHTML = ''; 

    if (meals && meals.length) {
        const mealsToDisplay = meals.slice(0, 6); 

        for (const meal of mealsToDisplay) {
            const mealDetails = await getMealDetails(meal.idMeal);
            const ingredients = getIngredients(mealDetails);

            mealCards.innerHTML += `
                <div class="meal-card">
                    <div class="meal-img-container">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-img">
                    </div>
                    <h3 class="meal-card-title">${meal.strMeal}</h3>
                    <p class="meal-card-description">${ingredients}</p> <!-- Display ingredients -->
                </div>`;
        }
    } else {
        mealCards.innerHTML = '<p>No meals found.</p>';
    }
}

function getIngredients(mealDetails) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = mealDetails[`strIngredient${i}`];
        const measure = mealDetails[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure} ${ingredient}`.trim());
        }
    }
    return ingredients.join(', '); 
}

// Recipes carousel scroll
const carousel = document.getElementById('recipes-carousel');
const btnLeft = document.querySelector('.carousel-btn-left');
const btnRight = document.querySelector('.carousel-btn-right');
if (carousel && btnLeft && btnRight) {
  btnLeft.addEventListener('click', () => {
    const card = carousel.querySelector('.restaurant-card');
    if (card) carousel.scrollBy({ left: -card.offsetWidth - 24, behavior: 'smooth' });
  });
  btnRight.addEventListener('click', () => {
    const card = carousel.querySelector('.restaurant-card');
    if (card) carousel.scrollBy({ left: card.offsetWidth + 24, behavior: 'smooth' });
  });
}

// Meal suggestion form logic
const mealForm = document.getElementById('meal-suggestion-form');
const mealResult = document.getElementById('meal-suggestion-result');
if (mealForm && mealResult) {
  mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    mealResult.classList.remove('active');
    mealResult.textContent = 'Fetching suggestions...';
    mealResult.style.display = 'block';
    const category = document.getElementById('meal-category').value;
    if (!category) {
      mealResult.textContent = 'Please select a category.';
      return;
    }
    // Fetch meals by category
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const data = await response.json();
      if (!data.meals || !data.meals.length) {
        mealResult.textContent = 'No meals found for this category.';
        return;
      }
      // Pick 3 unique random meals
      const shuffled = data.meals.sort(() => 0.5 - Math.random());
      const selectedMeals = shuffled.slice(0, 3);
      // Fetch details for each meal
      const mealDetailsArr = await Promise.all(selectedMeals.map(async (meal) => {
        const detailsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        const detailsData = await detailsRes.json();
        return detailsData.meals[0];
      }));
      // Build HTML for 3 meal cards
      mealResult.innerHTML = `<div class='meal-suggestion-grid'>${mealDetailsArr.map(meal => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure} ${ingredient}`.trim());
          }
        }
        return `<div class="meal-suggestion-card">
          <div class="meal-suggestion-img-wrap">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-suggestion-img">
          </div>
          <div class="meal-suggestion-info">
            <h3 class="meal-suggestion-title">${meal.strMeal}</h3>
            <p class="meal-suggestion-ingredients"><strong>Ingredients:</strong> ${ingredients.join(', ')}</p>
            <a href="${meal.strSource || meal.strYoutube}" target="_blank" class="button meal-suggestion-link">View Recipe</a>
          </div>
        </div>`;
      }).join('')}</div>`;
      mealResult.classList.add('active');
    } catch (err) {
      mealResult.textContent = 'Error fetching meal suggestions.';
    }
  });
}

// === RESTAURANT BOOKING LOGIC ===
const bookingForm = document.getElementById('booking-form');
const bookingResult = document.getElementById('booking-result');
if (bookingForm && bookingResult) {
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Get form values
    const name = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    const guests = document.getElementById('booking-guests').value;
    // Basic validation
    if (!name || !email || !phone || !date || !time || !guests) {
      bookingResult.textContent = 'Please fill in all required fields.';
      bookingResult.style.color = 'red';
      return;
    }
    // Simulate booking success
    bookingResult.style.color = 'var(--first-color)';
    bookingResult.innerHTML = `<strong>Thank you, ${name}!</strong><br>Your table for ${guests} guest(s) on <b>${date}</b> at <b>${time}</b> has been booked.<br>We look forward to welcoming you!`;
    bookingForm.reset();
  });
}