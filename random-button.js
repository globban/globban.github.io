const _Links = [
    "https://di.se", 
    "https://aftonbladet.se",
]; 


export default function randomButton(buttonId) {
    //get element
    const element = document.getElementById(buttonId);
    //add event listener to element
    element.addEventListener("click", () => {
        //get random number between 1 and number of links
        const randomIndex = Math.floor(Math.random() * _Links.length);
        //debug log
        console.log("log", [randomIndex, _Links[randomIndex]]);
        
        //open site in new tab/window
        window.open(_Links[randomIndex], "_blank");
        
        //change URL of current window
        //window.location.replace(_Links[randomIndex]);
    });
}








