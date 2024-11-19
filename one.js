const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('userList');
const userForm = document.getElementById('userForm');
const formTitle = document.getElementById('formTitle');
const userFormContent = document.getElementById('userFormContent');
const cancelBtn = document.getElementById('cancelBtn');
const errorMessage = document.getElementById('error-message');

// Event Listeners
document.getElementById('addUserBtn').addEventListener('click', showForm);
cancelBtn.addEventListener('click', hideForm);
userFormContent.addEventListener('submit', handleFormSubmit);

// Functions

// 1. Fetch and display users from API
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError('Failed to load users. Please try again.');
    }
}

// 2. Display users in the list
function displayUsers(users) {
    userList.innerHTML = ''; // Clear the list before displaying

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${user.name} (${user.email})</span>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
        `;
        userList.appendChild(li);
    });
}

// 3. Show error message
function showError(message) {
    errorMessage.textContent = message;
}

// 4. Show the form to add/edit a user
function showForm(user = {}) {
    formTitle.textContent = user.id ? 'Edit User' : 'Add New User';

    // Set the form fields based on the user data if editing
    document.getElementById('userId').value = user.id || '';
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('department').value = user.department || '';

    userForm.style.display = 'block'; // Show the form
}

// 5. Hide the form
function hideForm() {
    userForm.style.display = 'none'; // Hide the form
}

// 6. Handle form submission (Add/Edit)
async function handleFormSubmit(event) {
    event.preventDefault();

    const user = {
        id: document.getElementById('userId').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value
    };

    if (!user.firstName || !user.lastName || !user.email || !user.department) {
        showError('Please fill all fields');
        return;
    }

    try {
        let response;
        if (user.id) {
            // If there's an ID, update an existing user (Edit)
            response = await fetch(`${apiUrl}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
        } else {
            // Add a new user
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
        }

        const updatedUser = await response.json();
        fetchUsers(); // Refresh the list of users
        hideForm(); // Close the form
    } catch (error) {
        showError('Failed to save user. Please try again.');
    }
}

// 7. Edit a user
function editUser(userId) {
    const user = {
        id: userId,
        firstName: 'John', // For demo, replace with real data
        lastName: 'Doe',
        email: 'john.doe@example.com',
        department: 'HR'
    };
    showForm(user); // Show form pre-filled with user data
}

// 8. Delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchUsers(); // Refresh the list after deletion
        } else {
            showError('Failed to delete user. Please try again.');
        }
    } catch (error) {
        showError('Failed to delete user. Please try again.');
    }
}

// Fetch and display users on page load
fetchUsers();
