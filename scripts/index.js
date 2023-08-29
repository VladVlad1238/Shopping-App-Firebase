import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";



const appSetting =  {
  databaseURL: "https://realtime-database-1b0ef-default-rtdb.europe-west1.firebasedatabase.app/"
}


const app = initializeApp(appSetting)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


let flag = true

const inputFieldNode = document.querySelector('#input-field');
const addToCartBtnNode = document.querySelector('#add-btn');
const shoppingListNode = document.querySelector('#shopping-list');


const getInputValue = () => {
  const inputValue = inputFieldNode.value.trim();

  if(!inputValue) return;
  

  push(shoppingListInDB, inputValue);

  clearInputField();
};

onValue(shoppingListInDB, (snapshot) => {
  if(snapshot.exists()) {
      const shoppingArray = Object.entries(snapshot.val())

      clearShoppingList()

      for (let i = 0; i < shoppingArray.length; i++) {
        let item = shoppingArray[i]

      appendItemToShoppingLiest(item)
    }
  } else {
    shoppingListNode.innerText = 'No items here....'
  }
})

function appendItemToShoppingLiest(item) {
  let itemId = item[0];
  let itemValue = item[1]


  let newEl = document.createElement('li');
  newEl.classList.add('shopping-item');
  newEl.setAttribute('id', itemId)
  newEl.textContent = itemValue;
  
  newEl.addEventListener('click', () => {
    newEl.classList.add('shopping-item-green')
      newEl.addEventListener('click', () => {
        if(newEl.className.match('shopping-item-green')) {
          let exectLocationOfItemInDB = ref(database, `shoppingList/${itemId}`)
          remove(exectLocationOfItemInDB)
        }
      })
  })
  shoppingListNode.append(newEl)
};

const clearShoppingList = () => {
  shoppingListNode.innerHTML = "";
}

const clearInputField = () => {
  inputFieldNode.value = ""
  inputFieldNode.focus();
};


addToCartBtnNode.addEventListener('click', getInputValue);



