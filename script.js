const ttlQuestionCount=8;

const userdata ={};

let allQuestions=[];

let selectQuestions=[];

let userSelectAns=[];

let currentQuestionIdx=0;

let mark=0

let totalTime=35

//Timer

const formatTimer=(duration)=>{
let seconds =Math.floor(duration % 60);
let minutes = Math.floor((duration / 60) %60);
let hours = Math.floor(duration/(60*60));

return `${string(hours).padStart(2,0)}: ${string(minutes).padStart(2,0)} :${string(seconds).padStart(2,0)}`


}



const showTimer=()=>{


    const timer = document.getElementById("timer");
    timer.innerText=totalTime;


let timerInterval=setInterval(()=>{
    totalTime--;
    timer.innerText=totalTime;
    if(totalTime==0){
        clearInterval(timerInterval)
        loadingPage("Result.html");
    }

},1000)

}



// show answer

 const showAnswer=()=>{

    const answerContainer = document.getElementById("answerContainer")
   
    answerContainer.innerHTML = selectQuestions.map((question , qno) => `
    
    <div>
    
    <p> Question ${ qno+1 }:${question.question}  </p>   
    
    ${question.answers.map((ans,ansIdx)=>{ 
let color = "black";

if(question.correct == ansIdx){
    color ="green";
}else if (userSelectAns[qno]==ansIdx){
    color ="red";
}

        return `
        <p style ="color:${color}"> ${ans} </p>
        
        `;
    }) .join("")}
    
    </div>
    
    `
)
.join("");

 };

//select RandomQuestions
const selectRandomQuestion= () =>{
let suffledQuestions=allQuestions.sort(()=>{
    return 5 - Math.floor(Math.random()*10)
    
})

selectQuestions=suffledQuestions.slice(0, ttlQuestionCount);

};
//show Question
const showQuestion = () =>{
const currentQuestion = selectQuestions[currentQuestionIdx];

const questionContainer = document.getElementById("questioncontainer");

questionContainer.innerHTML = `
        <h4>Question ${currentQuestionIdx + 1}: ${currentQuestion.question}</h4>
        ${currentQuestion.answers.map((ans, idx) => {
          return `
          <div>
          <label>
          <input type="radio" name="answer" value="${idx}">${ans}</label></div>`;
        }).join("")}
    `;
};

// click submit loading next page
const initiasePage=(path)=>{
    if(path==="First.html"){
        document.getElementById("userform").addEventListener("submit",(e)=>{
            e.preventDefault();
            let userName = document.getElementById("uname").value
            let userMail = document.getElementById("umail").value

            userdata.uname=userName;
            userdata.umail=userMail;

            loadingPage("Intro.html");
        });
    }
    else if(path==="Intro.html"){
        document.getElementById("start").addEventListener("click",()=>{
            loadingPage("Quiz.html")
        });
    }
else if(path==="Quiz.html"){
showTimer();
    showQuestion();

    document.getElementById("pre").addEventListener("click" ,()=>{
        let selectAnswer = document.querySelector('input[name="answer"]:checked')
        if( selectAnswer){
            userSelectAns[currentQuestionIdx]=selectAnswer.value
        
        }
        currentQuestionIdx--;
        
        showQuestion()                
        
    })

    document.getElementById("next").addEventListener("click" ,()=>{

let selectAnswer = document.querySelector('input[name="answer"]:checked')

if( selectAnswer.value== selectQuestions[currentQuestionIdx].correct){

    mark++;
}

userSelectAns[currentQuestionIdx]=selectAnswer.value

        currentQuestionIdx++;
        if(currentQuestionIdx < ttlQuestionCount)

            showQuestion();
         else loadingPage("Result.html");   
    })

}
 
else if (path == "Result.html"){
document.getElementById("mark").textContent=`your score is ${mark} / ${ttlQuestionCount}`;
showAnswer();
}

};


// connecting to index.html
const loadingPage = (path) => {
    fetch(`./page/${path}`)
        .then((data) => data.text())
        .then((html) => {
            document.getElementById("app").innerHTML = html;
        initiasePage(path);
        })
        .catch((err)=>{
            console.log(err)
        })
};

//Fetch the Question.json
document.addEventListener("DOMContentLoaded", ()=>{
    loadingPage("First.html");
    fetch("question.json")
    .then((data)=> data.json())
    .then((question)=>{

allQuestions=question
selectRandomQuestion()
    })
});