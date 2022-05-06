function attachEventListeners() {
    let startQuesRadio = document.getElementById('startQues');
    startQuesRadio.addEventListener('click', () => startQuesRadio.select());

    document.getElementById('endQuesRadio').addEventListener('click', () => {
        let lastQuesRadio = document.getElementById('lastQuesRadio');
        lastQuesRadio.checked = false;
        let fieldText = document.getElementById('endQuesField');
        fieldText.select();
    });

    let textField = document.getElementById('endQuesField');
    textField.addEventListener('click', () => {
        let lastQuesRadio = document.getElementById('lastQuesRadio');
        lastQuesRadio.checked = false;
        let endQuesRadio = document.getElementById('endQuesRadio');
        endQuesRadio.checked = true;
        textField.select();
    });

    document.getElementById('lastQuesRadio').addEventListener('click', () => {
        let endQuesRadio = document.getElementById('endQuesRadio');
        endQuesRadio.checked = false;
    })
}

attachEventListeners();

let form = document.querySelector("form");

form.addEventListener("submit", function (event, activeTab) {
    try {
        const data = new FormData(form);
        const startQues = parseInt(data.get("startQues"));
        const endQues = parseInt(data.get("endQues"));
        const lastQues = data.get("lastQues");

        if (Math.min(startQues, endQues) < 1 || startQues > endQues) {
            throw new Error('Invalid range');
        }

        chrome.tabs.executeScript({
            code: `
            // var searchRegExp = /\s+/g;
            try{
                const ques = document.getElementsByClassName("G4EHhc");

                if(${startQues} > ques.length) {
                    throw new Error("Invalid Start Question value");
                }

                let start = ${startQues};
                let end;
                if("${lastQues}" == "on"){
                    end = ques.length;
                }
                else end = Math.min(${endQues}, ques.length);
                for(let i = start; i < end; i++){
                    let text = ques[i].innerHTML;
                    if(text[text.length-1] == '>'){
                        text = text.slice(0, text.search('<'))
                    }

                    //text = text.replace(/\s/g, '+');

                    let url = "https://www.google.com/search?q=" + text;

                    console.log(url);

                    window.open(url, '_blank');
                }
            }
            catch(err) {
                alert(err);
            }
            `
        })
    }
    catch (err) {
        document.getElementById("log").innerHTML = err;
    }
    event.preventDefault();
}, false)