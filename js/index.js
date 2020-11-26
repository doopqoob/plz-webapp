document.addEventListener("DOMContentLoaded", function () {
    setShowFromURL();
});

function setShowFromURL() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("show_id") !== null) {

        let buttonId = "show_" + urlParams.get("show_id");
        document.getElementById(buttonId).checked = true;

        setShow(urlParams.get("show_id"));
    }
}

function setShow(showId) {
    clearForm();
    showIdField = document.getElementById("show-id");
    showIdField.textContent = showId;
    showElement("select-buttons");
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add("silent");
}

function showElement(elementId) {
    document.getElementById(elementId).classList.remove("silent");
}

function getArtists() {
    clearForm();
    let showId = document.getElementById("show-id").textContent;
    getData("/api/v2/get_show_artists?show_id=" + showId)
        .then(result => {
            if (result.status === 200) {
                populateArtists(result.content['artists']);
                showElement("select-by-artist-div");
                getSongsByArtist(result.content['artists'][0][1]);
            }
        });
}

function getSongsByArtist() {
    let artistId = document.getElementById("artists").value;
    let showId = document.getElementById("show-id").textContent;
    depopulateList("songs-by-artist");
    getData("/api/v2/get_show_songs?show_id=" + showId + "&artist_id=" + artistId)
        .then(result => {
            populateSongsByArtist(result.content['songs']);
            setSongByArtist()
        });
}

function getSongsByTitle() {
    clearForm();

    let showId = document.getElementById("show-id").textContent;
    depopulateList("songs");
    getData("/api/v2/get_show_songs?show_id=" + showId)
        .then(result => {
            populateSongsByTitle(result.content['songs']);
            showElement("select-by-title-div");
            setSongByTitle()
        });
}

function populateArtists(artistList) {
    let artists = document.getElementById("artists");
    artistList.forEach(artist => {
        let option = document.createElement("option");
        option.value = artist[0];
        option.textContent = artist[1] + " (" + artist[2] + ")";
        artists.appendChild(option);
    });
}

function populateSongsByArtist(songList) {
    let songs = document.getElementById("songs-by-artist");
    songList.forEach(song => {
        let option = document.createElement("option");
        option.value = song[0];
        option.textContent = song[1];
        songs.appendChild(option);
    });
}


function populateSongsByTitle(songList) {
    let songs = document.getElementById("songs");
    songList.forEach(song => {
        let option = document.createElement("option");
        option.value = song[0];
        option.textContent = '"' + song[1] + '" by ' + song[2];
        songs.appendChild(option);
    });
}

function depopulateList(elementId) {
    let list_to_depopulate = document.getElementById(elementId);
    while (list_to_depopulate.firstChild) {
        list_to_depopulate.removeChild(list_to_depopulate.firstChild);
    }
}

function setSongByArtist() {
    let songs = document.getElementById("songs-by-artist");
    setSong(songs.value);
}

function setSongByTitle() {
    let songs = document.getElementById("songs");
    setSong(songs.value);
}

function setSong(songId) {
    document.getElementById("song-id").textContent = songId
}

function submitByArtist() {
    let url = "/api/v2/add_selected_request";
    let formData = {
        show_id: document.querySelector('input[name="show_id"]:checked').value,
        song_id: document.getElementById("song-id").textContent,
        submitted_by: document.getElementById("name-by-artist").value,
        notes: document.getElementById("notes-by-artist").value,
        email: document.getElementById("email").value
    };
    submitForm(url, formData);
}

function submitByTitle() {
    let url = "/api/v2/add_selected_request";
    let formData = {
        show_id: document.querySelector('input[name="show_id"]:checked').value,
        song_id: document.getElementById("song-id").textContent,
        submitted_by: document.getElementById("name-by-title").value,
        notes: document.getElementById("notes-by-title").value,
        email: document.getElementById("email").value
    };
    submitForm(url, formData);
}

function submitFreeForm() {
    let url = "/api/v2/add_freeform_request";
    let formData = {
        show_id: document.querySelector('input[name="show_id"]:checked').value,
        artist_name: document.getElementById("freeform-artist").value,
        song_title: document.getElementById("freeform-title").value,
        submitted_by: document.getElementById("freeform-submitted_by").value,
        notes: document.getElementById("freeform-notes").value,
        email: document.getElementById("email").value
    }
    submitForm(url, formData);
}

function submitForm(url, formData) {
    postData(url, formData)
        .then(result => {
            if (result.status === 201) {
                $("#success_modal").modal("show");
                clearForm();
            } else if (result.status === 401) {
                $("#ratelimit_modal").modal("show");
                clearForm();
            } else {
                $("#failure_modal").modal("show");
            }
        });
}

function showFreeformInput() {
    hideElement("select-by-artist-div");
    hideElement("select-by-title-div");
    hideElement("select-buttons");
    showElement("freeform-div")
}

function clearForm() {
    hideElement("select-by-artist-div");
    hideElement("select-by-title-div");
    hideElement("freeform-div");

    depopulateList("artists");
    depopulateList("songs");

    document.getElementById("name-by-artist").value = null;
    document.getElementById("name-by-title").value = null;

    document.getElementById("notes-by-artist").value = null;
    document.getElementById("notes-by-title").value = null;

    document.getElementById("freeform-artist").value = null;
    document.getElementById("freeform-title").value = null;
    document.getElementById("freeform-submitted_by").value = null;
    document.getElementById("freeform-notes").value = null;

    showElement("select-buttons");
}