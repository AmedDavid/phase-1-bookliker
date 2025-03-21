document.addEventListener("DOMContentLoaded", function () {
    const listPanel = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    const currentUser = { id: 1, username: "pouros" }; // Simulated logged-in user

    // Fetch and display books
    function fetchBooks() {
        fetch("http://localhost:3000/books")
            .then(response => response.json())
            .then(books => displayBookList(books));
    }

    function displayBookList(books) {
        listPanel.innerHTML = ""; // Clear existing list
        books.forEach(book => {
            const li = document.createElement("li");
            li.textContent = book.title;
            li.addEventListener("click", () => displayBookDetails(book));
            listPanel.appendChild(li);
        });
    }

    function displayBookDetails(book) {
        showPanel.innerHTML = `
            <h2>${book.title}</h2>
            <img src="${book.img_url}" alt="${book.title}">
            <p>${book.description}</p>
            <h3>Liked by:</h3>
            <ul id="user-list">
                ${book.users.map(user => `<li>${user.username}</li>`).join("")}
            </ul>
            <button id="like-btn">${isBookLiked(book) ? "Unlike" : "Like"}</button>
        `;

        document.getElementById("like-btn").addEventListener("click", () => toggleLike(book));
    }

    function isBookLiked(book) {
        return book.users.some(user => user.id === currentUser.id);
    }

    function toggleLike(book) {
        let updatedUsers;
        if (isBookLiked(book)) {
            updatedUsers = book.users.filter(user => user.id !== currentUser.id);
        } else {
            updatedUsers = [...book.users, currentUser];
        }

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ users: updatedUsers }),
        })
        .then(response => response.json())
        .then(updatedBook => displayBookDetails(updatedBook)); // Update UI with new data
    }

    fetchBooks(); // Load books on page load
});
