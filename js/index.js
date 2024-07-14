document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed'); // Check if DOMContentLoaded event fires
  
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchQuery = searchInput.value.trim(); // Get trimmed search input value
  
        if (searchQuery) {
          console.log('Search query:', searchQuery); // Log search query for debugging
          
          // Perform API request to GitHub API
          fetch(`https://api.github.com/search/users?q=${searchQuery}`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          })
          .then(response => response.json())
          .then(data => {
            console.log('GitHub API Response:', data); // Log API response for debugging
            
            // Clear previous results
            userList.innerHTML = '';
            reposList.innerHTML = '';
  
            // Process and display user search results
            data.items.forEach(user => {
              const li = document.createElement('li');
              const link = document.createElement('a');
              link.href = user.html_url;
              link.target = '_blank';
              link.textContent = user.login;
              li.appendChild(link);
              userList.appendChild(li);
  
              // Add click event to fetch and display user repos
              link.addEventListener('click', function(event) {
                event.preventDefault();
                fetch(user.repos_url, {
                  headers: {
                    'Accept': 'application/vnd.github.v3+json'
                  }
                })
                .then(response => response.json())
                .then(repos => {
                  console.log('User Repositories:', repos); // Log user repos for debugging
  
                  // Clear previous repo results
                  reposList.innerHTML = '';
  
                  // Display repositories
                  repos.forEach(repo => {
                    const repoLi = document.createElement('li');
                    repoLi.textContent = repo.name;
                    reposList.appendChild(repoLi);
                  });
                })
                .catch(error => {
                  console.error('Error fetching user repos:', error);
                });
              });
            });
          })
          .catch(error => {
            console.error('Error fetching GitHub users:', error);
          });
        } else {
          console.warn('Search query is empty');
        }
      });
    } else {
      console.error('Form element with id "github-form" not found.');
    }
  });
  