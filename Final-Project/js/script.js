
const toggle = document.querySelector("#toggle");
const sidebar = document.querySelector("#sidebar");
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("showSidebar");
})

const pagination = document.querySelector("#pagination");


let products = []
let priceFilterProduct = [];
let priceFilter = false;
let categoryFilter = false;
let categoryFilterProduct = [];
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const pageShow = document.querySelector("#pageShow");
let page = 1;


fetch('https://dummyjson.com/products?limit=194')
    .then(response => response.json())
    .then(data => {
        console.log(data.products);
        products = data.products;
        displayProduct(products.slice(0, 12))
    });

let container = document.querySelector("#container");

// display all product 
function displayProduct(disproducts) {
    let ihtm = "";
    disproducts.forEach((product, i) => {
        ihtm += `
            <div id="cart">
                <img src="${product.images[0]}" alt="">
                <h2 class="title" onclick=singleProduct(${product.id})>${product.title}</h2>
                <p>Price :- ${product.price}$</p>
                <p>Rating :- ${product.rating}<i class="ri-star-s-fill"></i></p>
                <button onclick=addTocart(${product.id})>Add to cart</button>
                <button onclick=deleteProduct(${product.id})>Delete</button>
            </div>
        `
    })
    container.innerHTML = ihtm;
    let checkNextData = [];
    if (priceFilter) {
        checkNextData = priceFilterProduct.slice(page * 12, (page * 12) + 1);
    } else if (categoryFilter) {
        checkNextData = categoryFilterProduct.slice(page * 12, (page * 12) + 1);
        console.log(products);
    } else {
        checkNextData = products.slice(page * 12, (page * 12) + 1);
    }
    console.log("checkNextData", checkNextData);
    console.log("price filter", priceFilter);
    if (checkNextData.length === 0) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}


// single product 
function singleProduct(id) {
    let product = products.find(item => item.id === id)
    localStorage.setItem("singleProduct", JSON.stringify(product));
    window.location.href = "singleProduct.html";
}

// delete product 
function deleteProduct(id) {
    fetch('https://dummyjson.com/products/' + id, {
        method: 'DELETE',
    }).then(res => res.json())
        .then(deletedProduct => {
            products = products.filter(item => item.id !== deletedProduct.id)
            console.log(products);
            let chechArr = products.slice((page - 1) * 12, page * 12);
            if (chechArr.length === 0) {
                page--;
                document.querySelector("#pageShow").innerHTML = page;
                document.querySelector("#next").disabled = true;
            }
            displayProduct(products.slice((page - 1) * 12, page * 12))
        })
}

// pagination 
pageShow.innerHTML = page;
prevBtn.addEventListener("click", () => {
    page--;
    pageShow.innerHTML = page;
    if (page <= 1) {
        prevBtn.disabled = true;
    }
    let pageProduct = [];
    if (priceFilter) {
        pageProduct = priceFilterProduct.slice((page - 1) * 12, page * 12)
    } else if (categoryFilter) {
        pageProduct = categoryFilterProduct.slice((page - 1) * 12, page * 12)
    } else {
        pageProduct = products.slice((page - 1) * 12, page * 12)
    }
    displayProduct(pageProduct)
    if (pageProduct.length >= 12) {
        nextBtn.disabled = false;
    }
})

nextBtn.addEventListener("click", () => {
    page++;
    pageShow.innerHTML = page;
    if (page >= 1) {
        prevBtn.disabled = false;
    }
    let pageProduct = [];
    let checkNextData = [];
    if (priceFilter) {
        pageProduct = priceFilterProduct.slice((page - 1) * 12, page * 12)
        checkNextData = priceFilterProduct.slice(page * 12, (page * 12) + 1);
    } else if (categoryFilter) {
        pageProduct = categoryFilterProduct.slice((page - 1) * 12, page * 12)
        checkNextData = categoryFilterProduct.slice(page * 12, (page * 12) + 1);
    } else {
        pageProduct = products.slice((page - 1) * 12, page * 12)
        checkNextData = products.slice(page * 12, (page * 12) + 1);
    }
    if (checkNextData.length === 0) {
        nextBtn.disabled = true;
    }
    displayProduct(pageProduct)
})


// shorting product by price 
const shortingByPrice = document.querySelector("#shortingByPrice");
const shortingArrow = document.querySelector("#shortingArrow")
let lowToHigh = true;
shortingByPrice.addEventListener("click", () => {
    if (lowToHigh) {
        products.sort((a, b) => a.price - b.price);
        lowToHigh = false;
        shortingArrow.innerHTML = "↓";
    } else {
        products.sort((a, b) => b.price - a.price);
        lowToHigh = true;
        shortingArrow.innerHTML = "↑";
    }
    page = 1;
    pageShow.innerHTML = page;
    prevBtn.disabled = true;
    displayProduct(products.slice(0, 12));
})

// searching 
const searching = document.querySelector("#searching");
searching.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    let filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchValue));
    if (filteredProducts.length === 0) {
        container.innerHTML = `<p style="font-size: 26px;">Product not found</p>`;
        return;
    }
    if (filteredProducts.length !== products.length) {
        pagination.style.display = "none";
        displayProduct(filteredProducts);
    } else {
        pagination.style.display = "block";
        displayProduct(products.slice(0, 12))
    }
})


// price filter 
let priceCheckbox = document.querySelectorAll(".priceCheckbox");
priceCheckbox.forEach(elem => {
    elem.addEventListener("change", function () {
        let checkboxValue = this.value;
        console.log(checkboxValue);

        if (this.checked) {
            switch (checkboxValue) {
                case '0-50':
                    priceFilterProduct = priceFilterProduct.concat(products.filter(product => product.price <= 50));
                    break;
                case '51-100':
                    priceFilterProduct = priceFilterProduct.concat(products.filter(product => product.price > 50 && product.price <= 100));
                    break;
                case '101-500':
                    priceFilterProduct = priceFilterProduct.concat(products.filter(product => product.price > 100 && product.price <= 500));
                    break;
                case '501-1500':
                    priceFilterProduct = priceFilterProduct.concat(products.filter(product => product.price > 500 && product.price <= 1500));
                    break;
                case '1500+':
                    priceFilterProduct = priceFilterProduct.concat(products.filter(product => product.price > 1500));
                    break;
                default:
                    break;
            }
        } else {
            switch (checkboxValue) {
                case '0-50':
                    priceFilterProduct = priceFilterProduct.filter(product => product.price > 50);
                    break;
                case '51-100':
                    priceFilterProduct = priceFilterProduct.filter(product => product.price <= 50 || product.price > 100);
                    break;
                case '101-500':
                    priceFilterProduct = priceFilterProduct.filter(product => product.price <= 100 || product.price > 500);
                    break;
                case '501-1500':
                    priceFilterProduct = priceFilterProduct.filter(product => product.price <= 500 || product.price > 1500);
                    break;
                case '1500+':
                    priceFilterProduct = priceFilterProduct.filter(product => product.price <= 1500);
                    break;
                default:
                    break;
            }
        }

        console.log(priceFilterProduct);
        page = 1;
        pageShow.innerHTML = page;
        prevBtn.disabled = true;

        let count = 0;
        for (let i = 0; i < priceCheckbox.length; i++) {
            if (!priceCheckbox[i].checked) {
                console.log("check");
                count++;
            }
        }
        console.log(count);
        if (count === priceCheckbox.length) {
            priceFilter = false;
            displayProduct(products.slice(0, 12));
        } else {
            priceFilter = true;
            displayProduct(priceFilterProduct.slice(0, 12));
        }
        console.log(priceFilterProduct);
        console.log(priceFilter);
    });

});


// category filter
let categoryCheckbox = document.querySelectorAll(".categoryCheckbox");
categoryCheckbox.forEach(elem => {
    elem.addEventListener("change", function () {
        let checkboxValue = this.value;
        if (this.checked) {
            switch (checkboxValue) {
                case 'mens': {
                    let isWomensChecked = false;
                    for (let i = 0; i < categoryCheckbox.length; i++) {
                        if (categoryCheckbox[i].value === 'womens' && categoryCheckbox[i].checked) {
                            console.log("womens haaaahhahahah");
                            isWomensChecked = true;
                        }
                    }
                    if (isWomensChecked) {
                        categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "mens-shirts" || product.category === "mens-shoes" || product.category === "mens-watches"))
                    } else {
                        categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "mens-shirts" || product.category === "mens-shoes" || product.category === "mens-watches" || product.category === "fragrances" || product.category === "sunglasses"))
                    }
                }

                    break;
                case 'womens': {
                    let isMensChecked = false;
                    for (let i = 0; i < categoryCheckbox.length; i++) {
                        if (categoryCheckbox[i].value === 'mens' && categoryCheckbox[i].checked) {
                            isMensChecked = true;
                        }
                    }
                    if (isMensChecked) {
                        categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "beauty" || product.category === "womens-bags" || product.category === "womens-dresses" || product.category === "womens-jewellery" || product.category === "womens-shoes" || product.category === "womens-watches" || product.category === "skin-care" || product.category === "tops"))
                    } else {
                        categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "beauty" || product.category === "womens-bags" || product.category === "womens-dresses" || product.category === "womens-jewellery" || product.category === "womens-shoes" || product.category === "womens-watches" || product.category === "sunglasses" || product.category === "skin-care" || product.category === "fragrances" || product.category === "tops"))
                    }
                }
                    break;
                case 'vehicle':
                    categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "vehicle" || product.category === "motorcycle"))
                    break;
                case 'groceries':
                    categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "groceries" || product.category === "home-decoration" || product.category === "kitchen-accessories"))
                    break;
                case 'electronics':
                    categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "laptops" || product.category === "mobile-accessories" || product.category === "smartphones" || product.category === "tablets"))
                    break;
                case 'furniture':
                    categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "furniture"))
                    break;
                case 'sports':
                    categoryFilterProduct = categoryFilterProduct.concat(products.filter(product => product.category === "sports-accessories"))
                    break;
                default:
                    break;
            }
        } else {
            switch (checkboxValue) {
                case 'mens': {
                    let isWomensChecked = false;
                    for (let i = 0; i < categoryCheckbox.length; i++) {
                        if (categoryCheckbox[i].value === 'womens' && categoryCheckbox[i].checked) {
                            console.log("womens haaaahhahahah");
                            isWomensChecked = true;
                        }
                    }
                    if (isWomensChecked) {
                        categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "mens-shirts" && product.category !== "mens-shoes" && product.category !== "mens-watches")
                    } else {
                        categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "mens-shirts" && product.category !== "mens-shoes" && product.category !== "mens-watches" && product.category !== "fragrances" && product.category !== "sunglasses")
                    }

                }
                    break;
                case 'womens':
                    let isMensChecked = false;
                    for (let i = 0; i < categoryCheckbox.length; i++) {
                        if (categoryCheckbox[i].value === 'mens' && categoryCheckbox[i].checked) {
                            console.log("womens haaaahhahahah");
                            isMensChecked = true;
                        }
                    }
                    if (isMensChecked) {
                        categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "beauty" && product.category !== "womens-bags" && product.category !== "womens-dresses" && product.category !== "womens-jewellery" && product.category !== "womens-shoes" && product.category !== "womens-watches" && product.category !== "skin-care" && product.category !== "tops")
                    } else {
                        categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "beauty" && product.category !== "womens-bags" && product.category !== "womens-dresses" && product.category !== "womens-jewellery" && product.category !== "womens-shoes" && product.category !== "womens-watches" && product.category !== "sunglasses" && product.category !== "skin-care" && product.category !== "fragrances" && product.category !== "tops")
                    }

                    break;
                case 'vehicle':
                    categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "vehicle" && product.category !== "motorcycle")
                    break;
                case 'groceries':
                    categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "groceries" && product.category !== "home-decoration" && product.category !== "kitchen-accessories")
                    break;
                case 'electronics':
                    categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "laptops" && product.category !== "mobile-accessories" && product.category !== "smartphones" && product.category !== "tablets")
                    break;
                case 'furniture':
                    categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "furniture")
                    break;
                case 'sports':
                    categoryFilterProduct = categoryFilterProduct.filter(product => product.category !== "sports-accessories")
                    break;
                default:
                    break;
            }
        }

        page = 1;
        pageShow.innerHTML = page;
        prevBtn.disabled = true;
        let count = 0;
        for (let i = 0; i < categoryCheckbox.length; i++) {
            if (!categoryCheckbox[i].checked) {
                count++;
            }
        }

        if (count === categoryCheckbox.length) {
            categoryFilter = false;
            displayProduct(products.slice(0, 12));
        } else {
            categoryFilter = true;
            displayProduct(categoryFilterProduct.slice(0, 12));
            console.log("category filter");
        }
        console.log("categoryFilterProduct", categoryFilterProduct);


    })
})



//add to cart
let add_to_cart_products = JSON.parse(localStorage.getItem("add_to_cart_products")) || [];

function addTocart(id) {
    for (let i = 0; i < add_to_cart_products.length; i++) {
        if (add_to_cart_products[i].id === id) {
            let quntity = add_to_cart_products[i].quntity;
            let price = add_to_cart_products[i].price / quntity;
            add_to_cart_products[i].quntity = ++quntity;
            add_to_cart_products[i].price = quntity * price;
            localStorage.setItem("add_to_cart_products", JSON.stringify(add_to_cart_products));
            return;
        }
    }
    let product = products.find(item => item.id === id);
    product.quntity = 1;
    add_to_cart_products.push(product);
    localStorage.setItem("add_to_cart_products", JSON.stringify(add_to_cart_products));
}

