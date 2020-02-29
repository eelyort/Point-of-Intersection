// button which is made using HTML
class ButtonHTML{
    // TODO: commented out so that can redo with only percentage coords
    // // creates a button, from initialization to HTML creation
    // constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, buttonFunc){
    //     // alert("Beginning of ButtonHTML constructor");
    //     // initialize variables
    //     // given percentage coords (0-1)
    //     if(isPercentage) {
    //         this.xTopLeft = Math.floor(xTopLeft * parentElement.offsetWidth);
    //         this.yTopLeft = Math.floor(yTopLeft * parentElement.offsetHeight);
    //         this.widthButton = Math.floor(widthButton * parentElement.offsetWidth);
    //         this.heightButton = Math.floor(heightButton * parentElement.offsetHeight);
    //     }
    //     // given absolute coords
    //     else{
    //         this.xTopLeft = xTopLeft;
    //         this.yTopLeft = yTopLeft;
    //         this.widthButton = widthButton;
    //         this.heightButton = heightButton;
    //     }
    //     this.buttonText = buttonText;
    //     this.myButtonFunc = buttonFunc;
    //
    //     // alert("Checkpoint 1 for buttonHTML");
    //
    //     // create HTML button
    //     this.myButton = documentButton.createElement("button");
    //     this.myButton.innerHTML = this.buttonText;
    //
    //     // alert("Checkpoint 2 for buttonHTML");
    //
    //     // append to document
    //     parentElement.appendChild(this.myButton);
    //
    //     // alert("Checkpoint 3 for buttonHTML");
    //
    //     // set properties
    //     // function
    //     this.myButton.addEventListener("click", this.myButtonFunc);
    //
    //     // alert("Checkpoint 4 for buttonHTML");
    //
    //     // position
    //     this.myButton.style.left = (this.xTopLeft).toString(10) + "px";
    //     this.myButton.style.top = (this.yTopLeft).toString(10) + "px";
    //     this.myButton.style.width = (this.widthButton).toString(10) + "px";
    //     this.myButton.style.height = (this.heightButton).toString(10) + "px";
    //
    //     // alert("Checkpoint 5 for buttonHTML");
    //
    //     // so its "above" the canvas
    //     this.myButton.style.position = "absolute";
    //     this.myButton.style.zIndex = "2";
    //
    //     // TODO: padding? No. do it in css file
    //
    //     // alert("End of ButtonHTML constructor");
    // }

    // creates a button, from initialization to HTML creation
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, buttonFunc){
        // initialize variables
        this.buttonText = buttonText;
        this.myButtonFunc = buttonFunc;
        this.xTopLeft = xTopLeft;
        this.yTopLeft = yTopLeft;
        this.widthButton = widthButton;
        this.heightButton = heightButton;
        this.isPercentage = isPercentage;

        // HTML stuff
        // create HTML button
        this.myButton = documentButton.createElement("button");
        this.myButton.innerHTML = this.buttonText;
        this.myButton.classList.add("gameButton");

        // append to document
        parentElement.appendChild(this.myButton);

        // set properties
        // function
        this.myButton.addEventListener("click", this.eventButtonClicked.bind(this));

        // so its "above" the canvas
        this.myButton.style.position = "absolute";
        this.myButton.style.zIndex = "2";

        // position
        // given percentage coords (0-1)
        if(this.isPercentage) {
            this.myButton.style.left = (this.xTopLeft * 100.0).toString(10) + "%";
            this.myButton.style.top = (this.yTopLeft * 100.0).toString(10) + "%";
            this.myButton.style.width = (this.widthButton * 100.0).toString(10) + "%";
            this.myButton.style.height = (this.heightButton * 100.0).toString(10) + "%";
        }
        // given absolute coords
        else{
            this.myButton.style.left = (this.xTopLeft).toString() + "px";
            this.myButton.style.top = (this.yTopLeft).toString() + "px";
            this.myButton.style.width = (this.widthButton).toString() + "px";
            this.myButton.style.height = (this.heightButton).toString() + "px";
        }
    }
    eventButtonClicked(){
        // alert("Parent");
        this.myButtonFunc();
    }
}

// button that toggles between functions
class ButtonHTMLToggle extends ButtonHTML{
    constructor(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, buttonFuncs){
        super(xTopLeft, yTopLeft, widthButton, heightButton, isPercentage, buttonText, parentElement, documentButton, null);
        // what function the toggle is currently on
        this.funcIndex = 0;
        this.myButtonFunctions = buttonFuncs;
    }
    toggleButtonFunc(){
        this.myButtonFunctions[this.funcIndex]();
        this.funcIndex++;
        if(this.funcIndex === this.myButtonFunctions.length){
            this.funcIndex = 0;
        }
    }
    eventButtonClicked() {
        // alert("Child");
        this.toggleButtonFunc();
    }
}

class answer{
    constructor(ans, id){
        this.id = id;
        this.ans = ans;
    }
}

class questionAns {
    constructor(ques, ans0, ans1, ans2, ans3, correctAns, message){
        this.question = ques;
        this.answers = [new answer(ans0, 0), new answer(ans1, 1), new answer(ans2, 2), new answer(ans3, 3)];
        this.correctAnswers = correctAns;
        this.message = message;
    }
    scramble(){
        for (let i = 0; i < 30; i++) {
            let i1 = Math.floor(Math.random() * 4);
            let i2 = Math.floor(Math.random() * 4);

            let temp = this.answers[i1];
            this.answers[i1] = this.answers[i2];
            this.answers[i2] = temp;

            // for (let j = 0; j < this.correctAnswers.length; j++) {
            //     if(this.correctAnswers[j] == i1){
            //         this.correctAnswers[j] = i2;
            //     }
            //     else if(this.correctAnswers[j] == i2){
            //         this.correctAnswers[j] = i1;
            //     }
            // }
        }
    }
    correct(choice){
        let ans = this.answers[choice].id;
        return ans in this.correctAnswers;
    }
}

const problems = [
    new questionAns("How many dynasties has China had?", "15", "16", "17", "1", [0, 1, 2], "There are many disagreements, so three of the answers are correct!"),
    new questionAns("How old (years) are the collective Chinese dynasties?", "4000", "2000", "300", "800", [0], "The first dynasty was founded in 2100 BCE!"),
    new questionAns("What Chinese dish is famous for being super spicy?", "Mapo Tofu", "Sichuan", "Buffalo Wild Wings", "Firecrackers", [0, 1], "Sichuan province, where Mapo Tofu is made, has a reputation for eating and creating very spicy food!"),
    new questionAns("Which Chinese Zodiac animal won the race and is the first in a rotation?", "Rat", "Ox", "Dragon", "tiger", [0], "The winner was the rat, who hid on the ox's head and jumped across first."),
    new questionAns("What does the lion dance signify?", "Prosperity", "Good Luck", "Wisdom", "Longevity", [0, 1, 2, 3], "The lion dance signifies all of these things!"),
    new questionAns("When did the Qing Dynasty fall?", "1911", "1913", "1914", "1902", [0], "The last Chinese Dynasty, the Qing Dynasty, fell in 1911."),
    new questionAns("Which of these Chinese shuttlecock records are real?", "All", "97 kicks while jump-roping in one minute", "98 passes in one minute", "27-kick long volley in a duel(like badminton)", [0], "These are all real records!")
];

function startMultipleChoice(callback) {
    let myDocument = document;

    let thisQuestion = problems[Math.floor(Math.random()*problems.length)];

    let correct = false;

    // create panel
    let myPanel = myDocument.createElement("div");
    myPanel.classList.add("myCard");
    myDocument.body.appendChild(myPanel);

    // inner cardContent
    let myCardContent = myDocument.createElement("div");
    myCardContent.classList.add("cardContent");
    myPanel.appendChild(myCardContent);

    // question
    let myQuestion = myDocument.createElement("p");
    myQuestion.innerHTML = thisQuestion.question;
    myCardContent.appendChild(myQuestion);

    // answers
    let myAnswers = [
        myDocument.createElement("div"),
        myDocument.createElement("div"),
        myDocument.createElement("div"),
        myDocument.createElement("div")
    ];
    thisQuestion.scramble();
    for (let i = 0; i < 4; i++) {
        let textElement = myDocument.createElement("p");
        textElement.innerHTML = thisQuestion.answers[i].ans;
        myAnswers[i].appendChild(textElement);

        // myAnswers[i].style.left = (2.5 + 20*i) + "vw";
        myAnswers[i].style.left = "5vw";
        // myAnswers[i].style.top = "40vh";
        myAnswers[i].style.top = (27 + 10*i) + "vh";
        myAnswers[i].addEventListener("click", function(){return select(i+0)});
        myAnswers[i].style.zIndex = "2";
        myAnswers[i].classList.add("answerCard");
        myCardContent.appendChild(myAnswers[i]);
        // alert((2.5 + 20*i) + "vw");
    }

    // let endEventListener = document.addEventListener("click", endMultipleChoice);

    function select(index) {
        correct = thisQuestion.correct(index);
        for (let i = 0; i < myAnswers.length; i++) {
            myAnswers[i].lastElementChild.style.color = ((thisQuestion.correct(i)) ? "#5dfc00" : "#eb4034");
        }
        myQuestion.innerHTML = ((correct) ? "Correct!" : "Wrong!") + "\n" + thisQuestion.message;
        myQuestion.style.color = ((correct) ? "#5dfc00" : "#eb4034");
        myDocument.addEventListener("click", endMultipleChoice);
    }

    // currently the first click both answers and deletes
    let counter = 0;
    function endMultipleChoice() {
        // alert("hi");
        if(counter > 0) {
            for (let i = 0; i < myAnswers.length; i++) {
                myAnswers[i].removeChild(myAnswers[i].lastElementChild);
                myAnswers[i].remove();
            }
            // myDocument.remove(myQuestion);
            // myDocument.remove(myCardContent);
            // myDocument.remove(myPanel);
            myQuestion.remove();
            myCardContent.remove();
            myPanel.remove();
            callback(correct);
        }
        else{
            counter++;
        }
    }
}