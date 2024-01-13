
import messages from '../lang/messages/en/user.js';
class Button {
  constructor(x, y, color, text) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
    this.element = null;
  }

  //essential functions

  createButton() {
    this.element = document.createElement("button");
    this.element.style.height = "5em";
    this.element.style.width = "10em";
    this.element.style.backgroundColor = this.color;
    this.element.innerText = this.text;
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    document.getElementById("buttonContainer").appendChild(this.element);
    //the above line adds the created button element( this.element) to the
    //html element with the ID 'buttonContainer'
  }

  moveButton(newX, newY) {
    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }
}

class ButtonGame {
  constructor() {
    this.buttons = [];
    this.buttonContainer = document.getElementById("buttonContainer");
    this.goButton = document.getElementById("goButton");
    this.numInput = document.getElementById("numButtons");

    this.goButton.addEventListener("click", () => this.createButtons());
    //here "this" refers to an instance of the ButtonGame
    //this attaches an event listener to the 'Go' button so
    //when the button is clicked, it calls the create buttons

    //this method will create the specifies number of buttons based
    // on the input value provided by the user.
  }

  createButtons() {
    const num = parseInt(this.numInput.value);

    if (num >= 3 && num <= 7) {
      this.clearButtons();

      // Calculate the total width of all buttons to center them
      const totalWidth = num * 10 * 16; // 10em width per button (assuming 1em = 16px)
      let startingX = (window.innerWidth - totalWidth) / 2; // Center buttons horizontally
      startingX = startingX < 0 ? 0 : startingX; // Make sure it's not negative

      // Define a fixed Y position to move buttons down from the top
      const startY = 300; // For example, 100 pixels from the top

      for (let i = 0; i < num; i++) {
        const button = new Button(
            startingX + i * (10 * 16), // Position buttons in a row horizontally
            startY, // Use the fixed Y position to move buttons down
            this.getRandomColor(),
            `${i + 1}`
        );
        button.createButton();
        this.buttons.push(button);
      }

      // Wait for 'num' seconds before scrambling buttons
      setTimeout(() => this.scatterButtons(num), num * 1000);
    } else {
      alert(messages.enterNumber);
    }
  }

  clearButtons() {
    this.buttonContainer.innerHTML = "";
    this.buttons = [];
  }

  scatterButtons(num) {
    let scatterCount = 0; // Counter to track the number of scatter iterations

    const scatterInterval = setInterval(() => {
      const scatterPromises = [];

      // Create promises to move each button
      for (let i = 0; i < num; i++) {
        const button = this.buttons[i];
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight - 50);

        // Create a promise to move each button
        const movePromise = new Promise((resolve) => {
          button.moveButton(newX, newY);
          resolve();
        });

        scatterPromises.push(movePromise);
      }

      // Wait for all buttons to finish moving before incrementing scatterCount
      Promise.all(scatterPromises).then(() => {
        scatterCount++;

        // Stop scattering after 3 iterations
        if (scatterCount === num) {
          clearInterval(scatterInterval);
          this.removeButtonText();
          this.enableButtonInteraction();
        }
      });
    }, 2000); // Scatter every 2 seconds
  }


//function to hide the button number after
  //the scattering is done
removeButtonText() {
    this.buttons.forEach(button => button.element.innerText = " ");
  }

  //function to enable interaction with the buttons
  //to enable the memory logic in the game.
  enableButtonInteraction() {
    let clickCount = 0;

    const originalOrder = this.buttons.map(button => button.text);

    this.buttons.forEach((button,index) => {
      button.element.addEventListener('click',() => {
        if(button.text === originalOrder[clickCount]) {
          button.element.innerText = button.text; //revealing number
          clickCount++;
          if (clickCount === originalOrder.length) {
            setTimeout(() => {
              alert(messages.excellentMemory)
            }, 100);
          }
        } else {
          alert(messages.wrongOrder);
          this.revealCorrectOrder();
        }
      })
    })
  }

  //function for revealing the correct order
  revealCorrectOrder() {
    this.buttons.forEach(button => {
      button.element.innerText = button.text;
      button.element.disabled = true; //optional: disable buttons
    })
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

const game = new ButtonGame();
