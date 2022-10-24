const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};


document.addEventListener('DOMContentLoaded', ()=>{
    fetchData();
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});

cards.addEventListener('click', e =>{
    addCarrito(e.target);
});

items.addEventListener('click', e =>{
    btnAction(e.target);
});

const fetchData = async () => {
    try{
        const res = await fetch('api.json');
        const data = await res.json();
        pintarCards(data);
    }catch(er){
        console.log(er);
    }
}


const pintarCards = data =>{
    data.forEach(product =>{
        templateCard.querySelector('h5').textContent = product.title;
        templateCard.querySelector('p').textContent = product.precio;
        templateCard.querySelector('img').setAttribute('src',product.thumbnailUrl);
        templateCard.querySelector('.btn-dark').dataset.id = product.id;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}

const addCarrito = e => {
    if(e.classList.contains('btn-dark')){
        setCarrito(e.parentElement);
    }
    // e.stopPropagation();
}

const setCarrito = object => {
    const product = {
        id: object.querySelector('.btn-dark').dataset.id,
        title: object.querySelector('h5').textContent,
        precio: object.querySelector('p').textContent,
        cantidad: 1
    };
    if(carrito.hasOwnProperty(product.id)){
        product.cantidad = carrito[product.id].cantidad +1;
    }
    carrito[product.id] = {...product};
    pintarCarrito();
}

const pintarCarrito = ()=>{
    items.innerHTML = '';
    Object.values(carrito).forEach(product=>{
        templateCarrito.querySelector('th').textContent = product.id;
        templateCarrito.querySelectorAll('td')[0].textContent = product.title;
        templateCarrito.querySelectorAll('td')[1].textContent = product.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = product.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = product.id;
        templateCarrito.querySelector('span').textContent = product.cantidad * product.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    pintarFooter();
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFooter = () =>{
    footer.innerHTML = '';
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>';
        return;
    }
    const nCantidad = Object.values(carrito).reduce((acumulador,{cantidad}) => acumulador + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acumulador,{cantidad,precio}) => acumulador + cantidad*precio, 0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click', () =>{
        carrito = {};
        pintarCarrito();
    });
}

const btnAction = e =>{
    if(e.classList.contains('btn-info')){
        const product = carrito[e.dataset.id]
        product.cantidad++;
        carrito[e.dataset.id] = {...product};
    }
    if(e.classList.contains('btn-danger')){
        const product = carrito[e.dataset.id]
        product.cantidad--;
        if(product.cantidad === 0){
            delete carrito[e.dataset.id];
        }
    }
    pintarCarrito();
}