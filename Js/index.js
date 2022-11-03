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
    var LogOutput = document.getElementById("Log");
    
    document.cookie.split("; ").forEach(function (cookie) {
        var [key, value] = cookie.split("=");
        if (key == "ChannelId") {
            ChannelIdInput.value = value
        } else if (key == "DiscordToken") {
            DiscordTokenInput.value = value
        }
    });

    function Log(Msg) {
        if (LogOutput.value.length <= 0) {
            LogOutput.value = Msg;
        } else {
            LogOutput.value = `${LogOutput.value}\r\n${Msg}`
        }
    }

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
                        Log(`Error Sending Typing: ${text}`);
                    });
                } else {
                    Log("Sent Typing");
                }
            } catch (error) {
                Log("Stoped Error");
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

    function ChannelIdInputted() {
        document.cookie = `ChannelId=${ChannelIdInput.value}`;
    };

    function DiscordTokenInputted() {
        document.cookie = `DiscordToken=${DiscordTokenInput.value}`;
        console.log(document.cookie["DiscordToken"]);
    };
    
    ToggleTypingButton.addEventListener("click", WhenButtonClicked);
    ChannelIdInput.addEventListener("input", ChannelIdInputted);
    DiscordTokenInput.addEventListener("input", DiscordTokenInputted);
});