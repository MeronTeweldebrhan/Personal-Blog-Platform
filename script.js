
document.addEventListener("DOMContentLoaded", function () {
  const postform = document.getElementById("postForm");
  const titleError = document.getElementById("titleError");
  const contentError = document.getElementById("contentError");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const postContainer = document.getElementById("postsContainer");

 

  // construct localStorage key and editId
  const localStorageKey = "blogPosts";
  let editId = null;

  // Functions to handle local storage
  function savePosts(posts) {
    console.log("Saving posts to localStorage:", posts); // Debug: Log posts being saved
    localStorage.setItem(localStorageKey, JSON.stringify(posts));
  }

  function getPosts() {
    const blogPosts = localStorage.getItem(localStorageKey);
    const posts = blogPosts ? JSON.parse(blogPosts) : [];
    console.log("Posts from localStorage:", posts); // Debug: Log posts retrieved
    return posts;
  }

  // Function to generate a unique ID
  function generateNumericId(length = 9) {
    let id = '';
    for (let i = 0; i < length; i++) {
      id += Math.floor(Math.random() * 10); // Generates digit 0–9
    }
    return '_' + id;
  }

  // Add event listener to the form
  postform.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    // Validate the title and content
    let isValid = true;
    titleError.classList.add("hidden");
    contentError.classList.add("hidden");

    if (!title) {
      titleError.classList.remove("hidden");
      isValid = false;
    }
    if (!content) {
      contentError.classList.remove("hidden");
      isValid = false;
    }

    if (!isValid) return;

    const posts = getPosts();
    // Check if we are editing an existing post
    if (editId) {
      const index = posts.findIndex((post) => post.id === editId);
      if (index === -1) {
        console.error(`Post with ID ${editId} not found for editing`);
        return;
      }
      posts[index].title = title;
      posts[index].content = content;
      savePosts(posts);
      renderPosts();
      editId = null;
    } 
    // If not editing, create a new post
    else {
      posts.push({
        id: generateNumericId(),
        title,
        content
      });
      savePosts(posts);
      renderPosts();
    }
    titleInput.value = "";
    contentInput.value = "";
  });

  // Function to render posts
  function renderPosts() {
    postContainer.innerHTML = "";// Clear previous posts
    const posts = getPosts();

    posts.forEach(post => {
      // Validate post data
      if (!post || !post.id || !post.title || !post.content) {
        console.warn("Invalid post data:", post);
        return;
      }
      // Create post elements
      const postElement = document.createElement("div");
      postElement.className = "post";
      
      const titleElement = document.createElement("h2");
      titleElement.textContent = post.title;
      const contentElement = document.createElement("p");
      contentElement.textContent = post.content;
      const editButton = document.createElement("button");
      editButton.className = "edit-btn";
      editButton.setAttribute("data-id", post.id);
      editButton.textContent = "Edit";
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.setAttribute("data-id", post.id);
      deleteButton.textContent = "Delete";

      postElement.appendChild(titleElement);
      postElement.appendChild(contentElement);
      postElement.appendChild(editButton);
      postElement.appendChild(deleteButton);
      postContainer.appendChild(postElement);
    });
  }

  // Add event listeners to the edit and delete buttons
  postContainer.addEventListener("click", function(event) {
    const target = event.target;
    const postId = target.getAttribute("data-id");

    if (!postId) return;

    console.log("Clicked postId:", postId); // Debug: Log postId to verify
// Check if the clicked element is an edit or delete button
    if (target.classList.contains("edit-btn")) {
      const posts = getPosts();
      const postToEdit = posts.find(post => post.id === postId);
      if (!postToEdit) {
        console.error(`Post with ID ${postId} not found for editing`);// Debug: Log error
        return;
      }
      titleInput.value = postToEdit.title;
      contentInput.value = postToEdit.content;
      titleError.classList.add("hidden");
      contentError.classList.add("hidden");
      editId = postId;
    } else if (target.classList.contains("delete-btn")) {
      const posts = getPosts();
      const updatedPosts = posts.filter(post => post.id !== postId);
      savePosts(updatedPosts);
      renderPosts();
    }
  });

  // Initial render of posts
  renderPosts();
});