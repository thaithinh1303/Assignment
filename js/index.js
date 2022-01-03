var db = window.openDatabase("NTT_Shop", "1.0", "NTTShop", 20000);

window.onload = on_load;

function on_load() {
    update_cart_quantity();
    var account_id = localStorage.getItem("account_id");
    if (account_id != "") {
        login_success();
    }
    else {
        logout();
    }
};

function get_products() {
    db.transaction(function(tx){
        var query = "SELECT * FROM product";

        tx.executeSql(
            query, 
            [], 
            function(tx, result) {
                log("INFO", "Get a list of products successfully");
               show_product(result.rows);
            },     
        transaction_error
       );
    });
}


function show_product(products) {
var product_list = document.getElementById("product-list");

for (var product of products) {
     product_list.innerHTML += `<div class="col-12 col-sm-6 col-lg-3 product">
                                    <div class="product-img">
                                        <img  src="${product.image}" alt="Product ${product.id}">
                                    </div>

                                    <div class="product-name">${product.name}</div>
                                    <div class="product-price">${product.price} VNĐ</div>                           
                                    
                                    <div class="product_end">
                                        <button onclick="add_to_cart(this.id)" id="${product.id}" class="add_to_cart_button">Add to Cart</button>
                                    </div>
                                </div>
                                `;
 }
}

function add_to_cart(product_id) {
    var account_id = localStorage.getItem("account_id");

    db.transaction(function (tx) {
        var query = `SELECT quantity FROM cart WHERE account_id = ? AND product_id = ?`;

        tx.executeSql(
            query,
            [account_id, product_id],
            function (tx, result) {
                if (result.rows[0]) {
                    update_cart_database(product_id, result.rows[0].quantity + 1);
                } else {
                    add_cart_database(product_id);
                }
            },
            transaction_error
        );
    });
};

function add_cart_database(product_id) {
    var account_id = localStorage.getItem("account_id");

    db.transaction(function (tx) {
        var query = `INSERT INTO cart (account_id, product_id, quantity) VALUES (?, ?, ?)`;
        tx.executeSql(
            query,
            [account_id, product_id, 1],
            function (tx, result) {
                log(`INFO`, `Insert cart successfully.`);
                update_cart_quantity();
            },
            transaction_error
        );
    });
};

function update_cart_database(product_id, quantity) {
    var account_id = localStorage.getItem("account_id");

    db.transaction(function (tx) {
        var query = `UPDATE cart SET quantity = ? WHERE account_id = ? AND product_id = ?`;
        tx.executeSql(
            query,
            [quantity, account_id, product_id],
            function (tx, result) {
                log(`INFO`, `Update cart successfully.`);
                update_cart_quantity();
            },
            transaction_error
        );
    });
};

function update_cart_quantity() {
    var account_id = localStorage.getItem("account_id")
    db.transaction(function (tx) {
        var query = `SELECT SUM(quantity) AS total_quantity FROM cart WHERE account_id = ?`;

        tx.executeSql(
            query,
            [account_id],
            function (tx, result) {
                if (result.rows[0].total_quantity) {
                    document.getElementById("cart-quantity").innerText = result.rows[0].total_quantity;
                } else {
                    document.getElementById("cart-quantity").innerText = 0;
                }
            },
            transaction_error
        );
    });
};

document.getElementById("frm-login").onsubmit = login;

function login(e) {
    e.preventDefault();

        // Get value from <input>.
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    db.transaction(function (tx) {
        var query = `SELECT * FROM account WHERE username = ? AND password = ?`;

        tx.executeSql(
            query, 
            [username, password], 
            function(tx, result) {
            if (result.rows[0]) {
            $("#frm-login").modal("hide");

            localStorage.setItem("account_id", result.rows[0].id );
            localStorage.setItem("account_username", result.rows[0].username );
                login_success();
                alert("Login successfully.");
            } else {
            logout();
            alert("Login failed."); 
            }
        }, 
        transaction_error
        );
    });
}

function login_success() {
    var username = localStorage.getItem("account_username");
    document.getElementById("account-info").innerHTML = `
    <button  class="btn ms-3 disable" >Hello ${username} !</button>
    <button onclick="logout()" id="btn-logout" class="btn btn-success" >Logout</button>
    `;
}

function logout() {
    localStorage.setItem("account_id", "");
    localStorage.setItem("account_username", "");

    document.getElementById("account-info").innerHTML = `
    <button id="btn-login" class="btn btn-success mt-2" data-bs-toggle="modal" 
                    data-bs-target="#frm-login">Login</button>
    `;
}

function get_cart_list() {
    var account_id = localStorage.getItem("account_id");
    db.transaction(function (tx) {
        var query = `
                SELECT p.id, c.quantity, p.name, p.price
                FROM product p, cart c
                WHERE p.id = c.product_id AND c.account_id = ?`

        tx.executeSql(
            query,
            [account_id],
            function (tx, result) {
                log(`INFO`, `Get a list of products in cart successfully.`);
                show_cart_list(result.rows);
            },
            transaction_error
        );
    });
};

function show_cart_list(products) {
    var total = 0;
    var cart_list = document.getElementById("cart-list");

    for (var product of products) {
        var amount = product.quantity * product.price;
        total += amount;
        cart_list.innerHTML += `<tr id="cart-list-item-${product.id}">
                                        <td class="text-start" id="cart-list-name-${product.id}">${product.name}</td>
                                        <td>${product.quantity}</td>
                                        <td>${product.price}</td>
                                        <td>${amount}</td>
                                        <td>
                                            <button onclick="delete_cart_item(this.id)" id="${product.id}" class="btn btn-danger btn-sm">Delete</button>
                                        </td>
                                    </tr>`;
    };

    cart_list.innerHTML += `<tr>
                                <td></td>
                                <td></td>
                                <td><strong>Total</td>
                                <td><strong>${total}</td>
                                <td></td>
                            </tr>`;
};

function delete_cart_item(product_id) {
    var account_id = localStorage.getItem("account_id");
    db.transaction(function (tx) {
        var query = `DELETE FROM cart WHERE account_id = ? AND product_id = ?`;

        tx.executeSql(
            query,
            [account_id, product_id],
            function (tx, result) {
                var product_row = document.getElementById(`cart-list-item-${product_id}`);
                var product_name = document.getElementById(`cart-list-name-${product_id}`);
                var message = `Delete ${product_name.innerText} successfully.`;

                product_row.outerHTML = "";

                log(`INFO`, message);
                alert(message);

                update_cart_quantity();
            },
            transaction_error
        );
    });
};