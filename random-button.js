const _Links = [

    "https://classic.minecraft.net/",
    "http://eelslap.com/",
    "https://alwaysjudgeabookbyitscover.com/",
    "https://cat-bounce.com/",
    "https://theuselessweb.com/",
    "https://oimo.io",
    "https://thisissand.com",
    "https://www.crazygames.com",
    "https://totaljerkface.com/happy_wheels.tjf",
    "https://orteil.dashnet.org/cookieclicker/",
    "https://www.coolmathgames.com",
    "https://www.crazygames.com/game/drift-hunters",
    "https://itch.io",
    "https://coolbackgrounds.io",
    "https://labs.openai.com",
    "https://libraryofbabel.info",
    "https://starblast.io",
    "https://2050.earth",
    "https://autodraw.com",
    "https://kodub.itch.io/polytrack",
    "https://googlefeud.com",
    "https://classicreload.com",
    "https://noclip.website",
    "https://www.spend-elon-fortune.com",
    "https://mecabricks.com",
    "https://geekprank.com/hacker/",
    "https://quickdraw.withgoogle.com",
    "https://unsplash.com",
    "https://www.geoguessr.com/",
    "https://www.thetruesize.com/",
    "https://neal.fun/space-elevator/",
    "https://neal.fun/wonders-of-street-view/",
    "https://neal.fun/perfect-circle/",
    "https://neal.fun/design-the-next-iphone/",
    "https://neal.fun/absurd-trolley-problems/",
    "https://neal.fun/deep-sea/",
    "https://neal.fun/life-stats/",
    "https://neal.fun/size-of-space/",
    "https://neal.fun/logos-from-memory/",
    "https://neal.fun/speed/",
    "https://neal.fun/auction-game/",
    "https://neal.fun/asteroid-launcher/",
    "https://ncs.io",
    "https://dogeminer2.com",
    "https://framesynthesis.com/drivingsimulator/maps/",
    "http://www.flashbynight.com/drench/",
    "https://www.linerider.com/",
    "https://www.shredsauce.com/"
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
        window.open(_Links[randomIndex], "_self");
        
        //change URL of current window
        //window.location.replace(_Links[randomIndex]);
    });
}








