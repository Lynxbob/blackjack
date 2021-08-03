async function retrieveLeaderboardData() {

    let leaderboardSection = document.querySelector(".leaderboard-section");

    let leaderboard = await fetch("/api/leaderboard",{
        method: "GET"
    }).then(response => response.json());


    for(let i = 0; i < 10 && i < leaderboard.length; i++) {
        let leaderboardUserElement = document.createElement("h4");
        leaderboardUserElement.classList.add("username-leaderboard");
        let leaderboardNumber = i+1;
        leaderboardUserElement.innerHTML = "" + leaderboardNumber + ".  " + leaderboard[i].username;
        let leaderboardChipsElement = document.createElement("h4");
        leaderboardChipsElement.classList.add("chip-count-leaderboard");
        leaderboardChipsElement.innerHTML = leaderboard[i].chips;
        leaderboardSection.appendChild(leaderboardUserElement);
        leaderboardSection.appendChild(leaderboardChipsElement);
    }
}


retrieveLeaderboardData();