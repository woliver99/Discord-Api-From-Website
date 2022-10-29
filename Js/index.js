var DiscordApi = "https://discord.com/api/v9/";
var ChannelUrl = DiscordApi + "channels/";
var TypingUrl = "/typing";
var SendLoopEnabled = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", function () {
    var ToggleTypingButton = document.getElementById("ToggleTyping");
    var DiscordTokenInput = document.getElementById("DiscordToken");
    var ChannelIdInput = document.getElementById("ChannelId");
    
    function StartLoop() {
        SendLoopEnabled = true;
        ToggleTypingButton.innerHTML = "Stop Typing";
        ToggleTypingButton.style.backgroundColor = "red";
    }

    function StopLoop() {
        SendLoopEnabled = false;
        ToggleTypingButton.style.backgroundColor = "green";
        ToggleTypingButton.innerHTML = "Start Typing";
    }

    async function SendTyping(Token, ChannelId) {
        console.log(Token + " " + ChannelId);
        while (SendLoopEnabled == true) {
            try{
                var Responce = fetch(ChannelUrl + ChannelId + TypingUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": Token,
                        "Content-Type": "application/json"
                    }
                });
                var result = await Responce;
                if (result.status != 204) {
                    await result.text().then(function (text) {
                        StopLoop();
                        alert(`Error Sending Typing: ${text}`);
                    });
                };
            } catch (error) {
                console.log("Stoped Error");
            }
            await sleep(2000);
        };
    } 

    function WhenButtonClicked(){
        if (SendLoopEnabled == true) {
            StopLoop()
        } else {
            StartLoop()
            SendTyping(DiscordTokenInput.value, ChannelIdInput.value);
        };
    };
    ToggleTypingButton.addEventListener("click", WhenButtonClicked);
});