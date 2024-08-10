document.addEventListener('DOMContentLoaded', () => {
    const weekdays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const weekdaysContainer = document.getElementById('weekdays');

    weekdays.forEach(day => {
        const dayCard = `
            <div class="day-card">
                <h2 class="subtitle">${day}</h2>
                <div class="field has-addons">
                    <p class="control is-expanded">
                        <label class="label">Almuerzo:</label>
                        <input class="input" type="text" name="${day.toLowerCase()}_almuerzo">
                    </p>
                    <p class="control">
                        <button class="button is-small is-info edit-meal" data-day="${day.toLowerCase()}" data-meal="almuerzo">
                            <img src="edit-05.svg" class="edit-icon" alt="Editar">
                        </button>
                    </p>
                </div>
                <div class="field has-addons">
                    <p class="control is-expanded">
                        <label class="label">Cena:</label>
                        <input class="input" type="text" name="${day.toLowerCase()}_cena">
                    </p>
                    <p class="control">
                        <button class="button is-small is-info edit-meal" data-day="${day.toLowerCase()}" data-meal="cena">
                            <img src="edit-05.svg" class="edit-icon" alt="Editar">
                        </button>
                    </p>
                </div>
            </div>
        `;
        weekdaysContainer.innerHTML += dayCard;
    });

    const form = document.getElementById('mealPlanForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sendData();
    });

    loadComidas();

    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterComidasByCategory(category);
        });
    });

    document.querySelectorAll('.edit-meal').forEach(button => {
        button.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const meal = this.getAttribute('data-meal');
            showEditMealPopup(day, meal);
        });
    });

    document.getElementById('saveCategoryButton').addEventListener('click', saveCategory);

    document.getElementById('generateMenuButton').addEventListener('click', generateMenu);

    document.getElementById('searchComidas').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        filterComidasBySearch(query);
    });
});

function renderComida(comida) {
    if (!comida.nombre || !comida.categoria) {
        return;
    }

    const comidaElement = document.createElement('div');
    comidaElement.classList.add('column', 'is-one-third');
    comidaElement.innerHTML = `
        <div class="card">
            <div class="card-content">
                <p class="title is-4">${comida.nombre}</p>
                <p class="subtitle is-6">${comida.categoria}</p>
                <p>${comida.ingredientes}</p>
            </div>
            <footer class="card-footer">
                <div class="card-footer-item">
                    <button class="button is-primary add-to-plan" data-ingredientes="${comida.ingredientes}">Agregar al plan</button>
                    <button class="button is-info edit-category" data-comida-id="${comida.id}">Editar categoría</button>
                </div>
            </footer>
        </div>
    `;

    comidaElement.querySelector('.add-to-plan').addEventListener('click', () => {
        showPopupForComida(comida.nombre, comida.ingredientes);
    });

    comidaElement.querySelector('.edit-category').addEventListener('click', () => {
        showCategoryPopup(comida.id);
    });

    return comidaElement;
}

function loadComidas() {
    fetch('get_comidas.php')
        .then(response => response.json())
        .then(comidas => {
            window.comidas = comidas;
            renderComidas();
        })
        .catch(error => {
            console.error('Error:', error);
            const comidasList = document.getElementById('comidasList');
            comidasList.innerHTML = '<p>Error al cargar las comidas.</p>';
        });
}

function renderComidas() {
    const comidasList = document.getElementById('comidasList');
    comidasList.innerHTML = '';

    const selectedCategory = document.querySelector('.category-button.is-selected')?.dataset.category;

    window.comidas.forEach(comida => {
        if (!selectedCategory || selectedCategory === 'Ver Todos' || comida.categoria.includes(selectedCategory)) {
            const comidaElement = renderComida(comida);
            if (comidaElement) {
                comidasList.appendChild(comidaElement);
            }
        }
    });
}

function showPopupForComida(comida, ingredientes) {
    const popup = document.getElementById('popupOverlay');
    popup.style.display = 'block';
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const ingredientList = document.getElementById('ingredientList');
    ingredientList.innerHTML = '';

    const ingredientsArray = ingredientes.split(',').map(ingredient => ingredient.trim());
    ingredientsArray.forEach(ingredient => {
        const ingredientItem = document.createElement('div');
        ingredientItem.classList.add('field', 'is-grouped');
        ingredientItem.innerHTML = `
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" class="ingredient-checkbox" value="${ingredient}"> ${ingredient}
                </label>
            </div>
        `;
        ingredientList.appendChild(ingredientItem);
    });

    step1.style.display = 'block';
    step2.style.display = 'none';

    document.getElementById('nextStep').addEventListener('click', () => {
        step1.style.display = 'none';
        step2.style.display = 'block';
    });

    document.getElementById('addComida').addEventListener('click', () => {
        const selectedSlot = document.querySelector('input[name="menuSlot"]:checked');
        if (selectedSlot) {
            addToPlan(selectedSlot.value, comida);
        }

        const selectedIngredients = document.querySelectorAll('.ingredient-checkbox:checked');
        const ingredientsToBuy = Array.from(selectedIngredients).map(checkbox => checkbox.value);
        const comprarSuperTextarea = document.getElementById('comprar_super');

        const currentIngredients = comprarSuperTextarea.value.split('\n').map(ing => ing.trim()).filter(ing => ing !== '');
        
        ingredientsToBuy.forEach(ingredient => {
            if (!currentIngredients.includes(ingredient)) {
                currentIngredients.push(ingredient);
            }
        });

        comprarSuperTextarea.value = currentIngredients.join('\n');

        popup.style.display = 'none';
    });
}

function addToPlan(slot, comida) {
    const input = document.querySelector(`input[name="${slot}"]`);
    if (input) {
        input.value = comida;
    }
}

function showCategoryPopup(comidaId) {
    const popup = document.getElementById('categoryPopup');
    popup.classList.add('is-active');
    document.getElementById('saveCategoryButton').dataset.comidaId = comidaId;
}

function saveCategory() {
    const popup = document.getElementById('categoryPopup');
    const checkboxes = document.querySelectorAll('.category-select:checked');
    const categories = Array.from(checkboxes).map(cb => cb.value);
    const comidaId = document.getElementById('saveCategoryButton').dataset.comidaId;

    fetch('update_comida_category.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comidaId, categories }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        loadComidas();
        popup.classList.remove('is-active');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('popupOverlay').style.display = 'none';
});
document.querySelector('.modal-background').addEventListener('click', () => {
    document.getElementById('popupOverlay').style.display = 'none';
});

function filterComidasByCategory(category) {
    document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('is-selected'));
    const selectedButton = document.querySelector(`.category-button[data-category="${category}"]`);
    if (selectedButton) {
        selectedButton.classList.add('is-selected');
    }
    renderComidas();
}

function filterComidasBySearch(query) {
    const comidasList = document.getElementById('comidasList');
    comidasList.innerHTML = '';

    window.comidas.forEach(comida => {
        if (comida.nombre.toLowerCase().includes(query) || comida.categoria.toLowerCase().includes(query)) {
            const comidaElement = renderComida(comida);
            if (comidaElement) {
                comidasList.appendChild(comidaElement);
            }
        }
    });
}

function generateMenu() {
    const weekdays = ['lunes_almuerzo', 'lunes_cena', 'martes_almuerzo', 'martes_cena', 'miercoles_almuerzo', 'miercoles_cena', 'jueves_almuerzo', 'jueves_cena', 'viernes_almuerzo', 'viernes_cena'];
    const planInputs = weekdays.map(day => document.querySelector(`input[name="${day}"]`));
    
    planInputs.forEach(input => input.value = '');

    const shuffledComidas = [...window.comidas].sort(() => Math.random() - 0.5);
    const ingredientsToBuy = [];

    planInputs.forEach((input, index) => {
        if (shuffledComidas[index]) {
            input.value = shuffledComidas[index].nombre;
            const ingredientes = shuffledComidas[index].ingredientes.split(',').map(ingredient => ingredient.trim());
            ingredientes.forEach(ingredient => {
                if (!ingredientsToBuy.includes(ingredient)) {
                    ingredientsToBuy.push(ingredient);
                }
            });
        }
    });

    const comprarSuperTextarea = document.getElementById('comprar_super');
    comprarSuperTextarea.value = ingredientsToBuy.join('\n');
}

function showEditMealPopup(day, meal) {
    const popup = document.getElementById('popupOverlay');
    popup.style.display = 'block';
    
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const comidasOptions = document.getElementById('comidasOptions');
    const ingredientList = document.getElementById('ingredientList');
    ingredientList.innerHTML = '';
    comidasOptions.innerHTML = '';

    window.comidas.forEach(comida => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('field');
        optionElement.innerHTML = `
            <label class="radio">
                <input type="radio" name="selectedComida" value="${comida.nombre}" data-ingredientes="${comida.ingredientes}">
                ${comida.nombre}
            </label>
        `;
        comidasOptions.appendChild(optionElement);
    });

    step1.style.display = 'block';
    step2.style.display = 'none';

    document.getElementById('nextStep').addEventListener('click', () => {
        const selectedComida = document.querySelector('input[name="selectedComida"]:checked');
        if (selectedComida) {
            const ingredientes = selectedComida.getAttribute('data-ingredientes');
            const ingredientsArray = ingredientes.split(',').map(ingredient => ingredient.trim());

            ingredientList.innerHTML = '';
            ingredientsArray.forEach(ingredient => {
                const ingredientItem = document.createElement('div');
                ingredientItem.classList.add('field', 'is-grouped');
                ingredientItem.innerHTML = `
                    <div class="control">
                        <label class="checkbox">
                            <input type="checkbox" class="ingredient-checkbox" value="${ingredient}"> ${ingredient}
                        </label>
                    </div>
                `;
                ingredientList.appendChild(ingredientItem);
            });

            step1.style.display = 'none';
            step2.style.display = 'block';
        }
    });

    document.getElementById('addComida').addEventListener('click', () => {
        const selectedComida = document.querySelector('input[name="selectedComida"]:checked').value;
        addToPlan(`${day}_${meal}`, selectedComida);

        const selectedIngredients = document.querySelectorAll('.ingredient-checkbox:checked');
        const ingredientsToBuy = Array.from(selectedIngredients).map(checkbox => checkbox.value);
        const comprarSuperTextarea = document.getElementById('comprar_super');

        const currentIngredients = comprarSuperTextarea.value.split('\n').map(ing => ing.trim()).filter(ing => ing !== '');
        
        ingredientsToBuy.forEach(ingredient => {
            if (!currentIngredients.includes(ingredient)) {
                currentIngredients.push(ingredient);
            }
        });

        comprarSuperTextarea.value = currentIngredients.join('\n');

        popup.style.display = 'none';
    });
}

// Envío de datos a EmailJS y guardado en la base de datos
function sendData() {
    const formData = new FormData(document.getElementById('mealPlanForm'));
    const plan = {
        lunes_almuerzo: formData.get('lunes_almuerzo'),
        lunes_cena: formData.get('lunes_cena'),
        martes_almuerzo: formData.get('martes_almuerzo'),
        martes_cena: formData.get('martes_cena'),
        miercoles_almuerzo: formData.get('miercoles_almuerzo'),
        miercoles_cena: formData.get('miercoles_cena'),
        jueves_almuerzo: formData.get('jueves_almuerzo'),
        jueves_cena: formData.get('jueves_cena'),
        viernes_almuerzo: formData.get('viernes_almuerzo'),
        viernes_cena: formData.get('viernes_cena'),
        comprar_super: formData.get('comprar_super'),
    };

    console.log('Datos que se enviarán:', plan); // Verificar los datos que se enviarán

    const emailData = {
        service_id: 'service_0isjz8r',
        template_id: 'template_oe1o3vo', // Reemplaza 'template_id' con el ID real de la plantilla de EmailJS
        user_id: 'su7bu8tVLFRR-ssfd',
        template_params: {
            lunes_almuerzo: plan.lunes_almuerzo,
            lunes_cena: plan.lunes_cena,
            martes_almuerzo: plan.martes_almuerzo,
            martes_cena: plan.martes_cena,
            miercoles_almuerzo: plan.miercoles_almuerzo,
            miercoles_cena: plan.miercoles_cena,
            jueves_almuerzo: plan.jueves_almuerzo,
            jueves_cena: plan.jueves_cena,
            viernes_almuerzo: plan.viernes_almuerzo,
            viernes_cena: plan.viernes_cena,
            comprar_super: plan.comprar_super,
            to_email: ['lucas.castillo@gmail.com', 'lucas.castillo@invera.com.ar'] // Incluye los destinatarios
        }
    };

    emailjs.send(emailData.service_id, emailData.template_id, emailData.template_params)
        .then(response => {
            console.log('Email sent successfully!', response.status, response.text);
        })
        .catch(error => {
            console.error('Error sending email:', error);
        });

    fetch('save_plan.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error saving plan:', data.error);
        } else {
            console.log('Plan saved successfully!', data);
        }
    })
    .catch(error => {
        console.error('Error saving plan:', error);
    });
}
