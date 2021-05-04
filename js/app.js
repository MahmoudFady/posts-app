// all variable declarations
const URL = "http://localhost:3000/api/post/";
let posts = [];
const noPosts = document.getElementById("no-posts");
const postListEle = document.querySelector("#posts-container .row");
const postsContainer = document.getElementById("posts-container");
const addPostForm = document.querySelector("form");
// all variable declarations
// display one post
const displayPost = async (_id, title, content, postMedia = []) => {
  postListEle.insertAdjacentHTML(
    "afterbegin",
    `<div class="col-md-6">
    <h4>${title}</h4>
    <p>${content}</p>
    <div id="postMediaContainer"></div>
    <button class="btn btn-danger" onclick="deletePostById(this,'${_id}')">delete</button>
    </div>`
  );
  const postMediaContainer = document.getElementById("postMediaContainer");
  for (let media of postMedia) {
    const mediaType = media.split(".")[1];
    if (mediaType == "jpg" || mediaType == "jfif" || mediaType == "png") {
      postMediaContainer.innerHTML += `<img width="50%" src="${media}">`;
    } else if (mediaType == "mp4") {
      postMediaContainer.innerHTML += `<video width="100%" controls ><source src="${media}"></video>`;
    } else if (mediaType == "mp3") {
      postMediaContainer.innerHTML += `<audio width="100%" controls ><source src="${media}"></audio>`;
    }
  }
};
// display array of posts
const displayAllPosts = (posts) => {
  for (let i = 0; i < posts.length; i++) {
    const { _id, title, content, postMedia } = posts[i];
    displayPost(_id, title, content, postMedia);
  }
};
// check if array of post is empty or not
const checkPostsExists = (posts) => {
  if (posts.length > 0) {
    postsContainer.style.display = "block";
    noPosts.style.display = "none";
  } else {
    postsContainer.style.display = "none";
    noPosts.style.display = "block";
  }
};
// delete post by it's id
const deletePostById = (evt, postId) => {
  const deletePost = confirm("do you want delete that post");
  if (deletePost) {
    deletePostFromDb(postId)
      .then((resualt) => {
        evt.parentElement.style.display = "none";
        posts = posts.filter((post) => post._id != postId);
        checkPostsExists(posts);
      })
      .catch((err) => {
        alert("faid to delete post");
      });
  } else {
    return 0;
  }
};
// get post from db
const getPosts = async () => {
  const response = await fetch(URL);
  return await response.json();
};

// send post data to the server
const sendDataToServer = async (postData) => {
  const { title, content, postMedia } = postData;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  for (let i = 0; i < postMedia.length; i++) {
    formData.append("postMedia", postMedia[i]);
  }
  const response = await fetch(URL, {
    method: "POST",
    body: formData,
  });
  const resualt = await response.json();
  return resualt;
};
// delete post form db
const deletePostFromDb = async (postId) => {
  const response = await fetch(URL + postId, { method: "DELETE" });
  const resualt = await response.json();
  return resualt;
};
// first function will excute
(async function () {
  await getPosts().then((response) => {
    posts = response.posts;
  });
  checkPostsExists(posts);
  posts.length > 0 ? displayAllPosts(posts) : false;
})();
//+++++++++++++++=
// submit form
addPostForm.onsubmit = function (evt) {
  evt.preventDefault();
  const title = addPostForm["title"].value;
  const content = addPostForm["content"].value;
  const postMedia = addPostForm["postMedia"].files;
  if (title.trim() == "" || content.trim() == "") {
    alert("plz enter title and content");
  } else {
    sendDataToServer({ title, content, postMedia })
      .then((resualt) => {
        const { _id, title, content, postMedia } = resualt.newPost;
        posts.push({ _id, title, content });
        displayPost(_id, title, content, postMedia);
        checkPostsExists(posts);
        imagePreview.innerHTML = "";
        imagePreview.style.display = "none";
        this.reset();
      })
      .catch((err) => {
        alert("faid to add post..");
      });
  }
};
// pick post media on front end
const imagePreview = document.getElementById("imagePreview");
document.getElementById("postMedia").onchange = function (evt) {
  imagePreview.innerHTML = "";
  const files = evt.target.files;
  imagePreview.style.display = files.length > 0 ? "block" : "none";
  for (let i = 0; i < files.length; i++) {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const mediaType = fileReader.result.slice(0, 10);
      console.log(mediaType);
      if (mediaType == "data:image") {
        imagePreview.innerHTML += `<img width="50%" src="${fileReader.result}">`;
      } else if (mediaType == "data:video") {
        imagePreview.innerHTML += `<video width="100%" controls ><source src="${fileReader.result}"></video>`;
      } else if (mediaType == "data:audio") {
        imagePreview.innerHTML += `<audio width="100%" controls ><source src="${fileReader.result}"></audio>`;
      }
    };
    fileReader.readAsDataURL(files[i]);
  }
};
