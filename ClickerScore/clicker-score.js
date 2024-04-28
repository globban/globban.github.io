//click handler, stores user score in localstorage and highscore online in DB

const API_URL = "https://ip2a924sh6.execute-api.eu-north-1.amazonaws.com";

const storeHighScore = async (highScore) => {
    const response = await fetch(API_URL+"/items", {
        method: "PUT", // or 'PUT'
        body: JSON.stringify({"id":"clickscore", "value": highScore }),
    });
}

const getHighScore = async () => {
    const response = await fetch(API_URL+"/items/clickscore")
	    .then((res) => res.json());	
	const highScore = response.value; //get the highscore value
	return highScore;			
}

export default async function initScoreHandler(clickButtonId, currentScoreDivId, highScoreDivId ) {
    //get user score from local storage
    let userScore = 0;
    if(localStorage.getItem("score") == null) {
        localStorage.setItem("score", 0);
    }
    else {
        userScore = Number(localStorage.getItem("score"));
        document.getElementById(currentScoreDivId).innerHTML = userScore;
    }
    
    document.getElementById(highScoreDivId).innerHTML = Number(await getHighScore());

    //get element
    const element = document.getElementById(clickButtonId);
    //add event listener to element
    element.addEventListener("click", async () => {
        let currentScore = Number(document.getElementById(currentScoreDivId).innerHTML);
        currentScore += 1;
        localStorage.setItem("score", currentScore);
        document.getElementById(currentScoreDivId).innerHTML = currentScore;

        const highScore = Number(await getHighScore());
        if( currentScore > highScore )
        {
            await storeHighScore(currentScore);
            document.getElementById(highScoreDivId).innerHTML = currentScore;
        }

        document.getElementById(highScoreDivId).innerHTML = Number(await getHighScore());
    });
}
