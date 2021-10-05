var form = document.querySelector("form");

form.addEventListener("submit", function(event, activeTab){
    try{
        var data = new FormData(form);
        var quesCount = data.get("quesCount");
        var startQues = parseInt(data.get("startQues"));
        var endQues = parseInt(data.get("endQues"));

        if(Math.min(startQues, endQues) < 1 || startQues > endQues){
            throw new Error('Invalid range');
        }

        chrome.tabs.executeScript({
            code: `
            console.log("Question Count : ${quesCount}");
            console.log("Start Question : ${startQues}");
            console.log("End Question : ${endQues}");

            // var searchRegExp = /\s+/g;

            var ques = document.getElementsByClassName("freebirdFormviewerComponentsQuestionBaseTitle exportItemTitle freebirdCustomFont");

            var start, end;
            if("${quesCount}" == "allQues"){
                start = 0;
                end = ques.length;
            }
            else{
                start = Math.min(${startQues-1}, ques.length-1);
                end = Math.min(${endQues}, ques.length);
            }
            for(var i = start; i < end; i++){
                var text = ques[i].innerHTML;
                if(text[text.length-1] == '>'){
                    text = text.slice(0, text.search('<'))
                }

                //text = text.replace(/\s/g, '+');

                var url = "https://www.google.com/search?q=" + text;

                console.log(url);

                window.open(url, '_blank');
            }
            `
        })
    }
    catch(err){
        document.getElementById("log").innerHTML = err;
    }
    event.preventDefault();
}, false)