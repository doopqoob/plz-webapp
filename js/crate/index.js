document.addEventListener("DOMContentLoaded", function () {
    getShows();
    getAllCrates();
});

function getShows() {
    getData("/api/v2/get_shows")
        .then(result => {
            populateShowList(result.content['shows']);
        });
}

function populateShowList(showList) {
    let showSelect = document.getElementById("shows");
    showList.forEach(show => {
        let showOption = document.createElement("option");
        showOption.value = show[0];
        showOption.textContent = show[1];
        showSelect.appendChild(showOption);
    })
}

function getAllCrates() {
    getData('/api/v2/get_crates')
        .then(result => {
            populateCrateList(result.content['crates'])
            getShowCrates();
        });
}

function getShowCrates() {
    let showId = document.getElementById("shows").value

    getData('/api/v2/get_crates?show_id=' + showId)
        .then(result => {
            checkCrateList(result.content['crates'])
        });
}

function populateCrateList(crateList) {
    let crateDiv = document.getElementById("crates");
    crateList.forEach(crate => {
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "crate-" + crate[0]);
        checkbox.setAttribute("name", "crate");
        checkbox.setAttribute("value", crate[0]);
        checkbox.onclick = function() {
            toggleAndSave(crate[0]);
        }

        let checkboxDiv = document.createElement("div");
        checkboxDiv.appendChild(checkbox);

        let checkboxLabel = document.createElement("label");
        checkboxLabel.setAttribute("for",'crate-' + crate[0]);
        checkboxLabel.textContent = crate[1];

        checkboxDiv.appendChild(checkboxLabel);
        crateDiv.appendChild(checkboxDiv);
    })
}

function toggleAndSave(crateId) {
    console.log(crateId);
    let checkBox = document.getElementById("crate-" + crateId)
    let showId = parseInt(document.getElementById("shows").value);
    if (checkBox.checked) {
        associateCrate(showId, crateId);
    } else {
        disassociateCrate(showId, crateId);
    }
}

function checkCrateList(crateList) {
    let crateSet = new Set();
    crateList.forEach(crate => {
        crateSet.add(crate[0]);
    })

    let crateDiv = document.getElementById("crates");
    crateDiv.childNodes.forEach(checkboxDiv => {
        checkboxDiv.childNodes.forEach(child => {
            if (child.nodeName === "INPUT") {
                child.checked = crateSet.has(parseInt(child.value));
            }
        });
    });
}

function associateCrate(showId, crateId) {
    let crateIds = [crateId];
    let data = {
        "show_id": showId,
        "crate_ids": crateIds
    };
    let apiKey = getApiKey();
    postData('/api/v2/associate_crates', data, apiKey["credential_id"], apiKey["credential_secret"])
        .then (result => {
            console.log(result)
        })
}

function disassociateCrate(showId, crateId) {
    let crateIds = [crateId];
    let data = {
        "show_id": showId,
        "crate_ids": crateIds
    };
    let apiKey = getApiKey();
    postData('/api/v2/disassociate_crates', data, apiKey["credential_id"], apiKey["credential_secret"])
        .then (result => {
            console.log(result)
        })
}