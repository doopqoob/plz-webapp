document.addEventListener("DOMContentLoaded", function () {
    populateBlocklist();
});

function populateBlocklist() {
    let urlParams = new URLSearchParams(window.location.search);
    let ip_address = urlParams.get("ip_address");

    document.getElementById("ip-address").textContent = ip_address;
}

function cancelButton() {
    history.back();
}

function continueButton() {
    let apiKey = getApiKey();
    let ip_address = document.getElementById("ip-address").textContent;
    let notes = document.getElementById("notes").value;

    let url = "/api/v2/block_ip";
    let data = {
        "ip_address": ip_address,
        "notes": notes
    };

    postData(url, data, apiKey["credential_id"], apiKey["credential_secret"])
        .then(result => {
            console.log(result);
            if (result.status === 200) {
                alert("IP has already been blocklisted");
                history.back();
            }
            else if (result.status === 201) {
                alert("IP has been successfully blocked");
                history.back();
            }
            else {
                alert("Something went wrong blocklisting this IP. Please try again.")
            }
        })
}
