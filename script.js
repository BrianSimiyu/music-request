// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyA38jw2PMH40_1dhzKBYL-YONidfpVqzlM",
  authDomain: "music-request-dd100.firebaseapp.com",
  databaseURL:
    "https://music-request-dd100-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "music-request-dd100",
  storageBucket: "music-request-dd100.appspot.com",
  messagingSenderId: "978464309810",
  appId: "1:978464309810:web:6a8981c2e9f894c903b22b",
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();

// Get a reference to the request form
var requestForm = document.getElementById("request-form");

// Get a reference to the request list
var requestList = document.getElementById("request-list");

// Listen for the form submission
requestForm.addEventListener("submit", function (event) {
  // Prevent the default form behavior
  event.preventDefault();

  // Get the input values
  var songTitle = requestForm["song-title"].value;
  var artistName = requestForm["artist-name"].value;

  // Create a new request object with timestamp
  var timestamp = firebase.database.ServerValue.TIMESTAMP;
  var newRequestRef = database.ref("requests").push();
  newRequestRef.set({
    songTitle: songTitle,
    artistName: artistName,
    timestamp: timestamp,
  });

  // Clear the form inputs
  requestForm.reset();
});

// Listen for new requests and display them on the page
database
  .ref("requests")
  .orderByChild("timestamp")
  .on("child_added", function (snapshot) {
    var request = snapshot.val();
    var requestItem = document.createElement("div");
    requestItem.classList.add("request-item");
    var timestamp = new Date(request.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    requestItem.innerHTML = `
    <p class="song-title" >${request.songTitle}</p>
    <p class="artist-name">${request.artistName}</p>
    <p class="timestamp">${timestamp}</p>
    
    <i class="fa fa-copy copy-button"></i>
  `;
    requestList.appendChild(requestItem);

    var copyButton = requestItem.querySelector(".copy-button");
    var songTitle = request.songTitle;
    var artistName = request.artistName;
    copyButton.addEventListener("click", function () {
      var textToCopy = songTitle + " " + artistName;
      navigator.clipboard.writeText(textToCopy).then(
        function () {
          var copiedMessage = document.createElement("span");
          copiedMessage.innerText = "Copied!";
          copiedMessage.classList.add("copied-message");
          copyButton.parentNode.insertBefore(
            copiedMessage,
            copyButton.nextSibling
          );
          setTimeout(function () {
            copiedMessage.remove();
          }, 200);
        },
        function () {
          console.error("Failed to copy to clipboard.");
        }
      );
    });
  });
