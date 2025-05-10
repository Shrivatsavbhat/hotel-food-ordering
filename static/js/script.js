let orders = [];
let totalAmount = 0;

// Fetch menu items from the server
async function loadMenu() {
    const response = await fetch('/menu');
    const menuItems = await response.json();

    const menuContainer = document.getElementById('menu-container');
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';

        menuItem.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p><strong>Price:</strong> ₹${item.price}</p>
                <button onclick="orderFood('${item.name}', ${item.price})">Order Now</button>
            </div>
        `;

        menuContainer.appendChild(menuItem);
    });
}

// Add an item to the order
function orderFood(itemName, price) {
    orders.push({ name: itemName, price: price });
    totalAmount += price;
    updateOrderList();
}

// Update the order list UI
function updateOrderList() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    orders.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - ₹${item.price}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-button';
        removeButton.onclick = () => removeOrder(index);

        listItem.appendChild(removeButton);
        orderList.appendChild(listItem);
    });

    document.getElementById('total-amount').textContent = `Total Amount: ₹${totalAmount}`;
}

// Remove an item from the order
function removeOrder(index) {
    totalAmount -= orders[index].price;
    orders.splice(index, 1);
    updateOrderList();
}

// Submit the order to the server
async function submitOrder() {
    if (orders.length === 0) {
        alert("No items in the order. Please add items to proceed.");
        return;
    }

    const response = await fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: orders, total: totalAmount })
    });

    if (response.ok) {
        const data = await response.json();
        alert(data.message);
        orders = [];
        totalAmount = 0;
        updateOrderList();
    } else {
        alert("Failed to submit the order. Please try again.");
    }
}

// Print the bill
function printBill() {
    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write('<h1>Hotel Bill</h1>');
    newWindow.document.write('<table border="1" style="width:100%; text-align:left;">');
    newWindow.document.write('<tr><th>Item</th><th>Price</th></tr>');
    orders.forEach(order => {
        newWindow.document.write(`<tr><td>${order.name}</td><td>₹${order.price}</td></tr>`);
    });
    newWindow.document.write(`<tr><td><strong>Total</strong></td><td><strong>₹${totalAmount}</strong></td></tr>`);
    newWindow.document.write('</table>');
    newWindow.document.close();
    newWindow.print();
}

// Load menu on page load
document.addEventListener('DOMContentLoaded', loadMenu);
