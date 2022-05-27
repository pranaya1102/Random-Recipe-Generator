
const randomMealButton = document.getElementById('random-meal-btn')
const mealSection = document.querySelector('.meal')
const mealContainer = mealSection.querySelector('.container')
const backButton1 = document.querySelector('.btn-back.btn-1')
const backButton2 = document.querySelector('.btn-back.btn-2')

const mealsSection = document.querySelector('.meals')
const mealCards = document.querySelector('.meal-cards')
const searchButton = document.getElementById('search-meal-btn')
const searchForm = mealsSection.querySelector('.search-form')

const loader = document.querySelector('.loader')


//timeout

setTimeout(()=>{
popupform(); 
},3000);



let feedback  = {
  liked : null,
  choice : [],
  suggestion : null,
  user : null

}
if (sessionStorage.length !== 0) {
  feedback.user = JSON.parse(sessionStorage.getItem("user"));
  console.log(typeof sessionStorage.getItem("user"));
}
function popupform(){
  getElementById("container").hidden=true;
 getElementById("container2").hidden=false;
 getElementById("form1").hidden = false;
 

}
//event listner for form 1
getElementById("form1_button").addEventListener("click", (event) => {
  let optionChosen = false;
  if (getElementById("form1_yes").checked) {
    optionChosen = true;
    feedback.liked = "yes";
    getElementById("form1").hidden = true;
    getElementById("form3").hidden = false;
  } else if (getElementById("form1_no").checked) {
    optionChosen = true;
    feedback.liked = "no";
    getElementById("form1").hidden = true;
    getElementById("form2").hidden = false;
  } else if (getElementById("form1_not_sure").checked) {
    optionChosen = true;
    feedback.liked = "not sure";
    getElementById("form1").hidden = true;
    getElementById("form3").hidden = false;
  }
  if (optionChosen === false) {
    alert("please choose any option");
  }
});

//event listner for form 2
getElementById("form2_button").addEventListener("click", (event) => {
  if (getElementById("form2_1").checked) {
    feedback.choice.push(getElementById("form2_1").value);
  }
  if (getElementById("form2_2").checked) {
    feedback.choice.push(getElementById("form2_2").value);
  }
  if (getElementById("form2_3").checked) {
    feedback.choice.push(getElementById("form2_3").value);
  }
  if (getElementById("form2_4").checked) {
    feedback.choice.push(getElementById("form2_4").value);
  }
  if (getElementById("form2_5").checked) {
    feedback.choice.push(getElementById("form2_5").value);
  }
  getElementById("form2").hidden = true;
  getElementById("form3").hidden = false;
});

getElementById("form3_button").addEventListener("click", (event) => {
  feedback.suggestion = getElementById("from3_response").value;
  if (feedback.feedback === "") {
    alert("please fill this field");
  } else {
    getElementById("form3").hidden = true;
    alert("Thanks for your response");
    console.log(feedback);

    getElementById("container").hidden=false;
 getElementById("container2").hidden=true;

    fetch("http://localhost:8081/user/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });
  }
 });

function showallfeedback() {
  location.href = "http://localhost:8081/show-feedbacks";
}

const showLoading = () => {
  loader.classList.add('show')
  setTimeout(() => {
    loader.classList.remove('show')
  }, 5000);
}

const hideLoading = () => {
  loader.classList.remove('show')
}

randomMealButton.onclick = () => {
  showLoading()
  mealSection.classList.add('active')

  // Fetch API
  fetch('https://www.themealdb.com/api/json/v1/1/random.php') // for dummy api we can replace this url with 127.0.0.0/users/random
    .then(res => res.json())
    .then(res => {
      getMeal(res.meals[0])
      hideLoading()
    })
}

const getMeal = (meal) => {
  const ingredients = []
  // Get ingredients
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    } else {
      // Stop if no more ingredients
      break
    }
  }

  const mealName = mealSection.querySelector('.meal__name')
  const mealArea = mealSection.querySelector('.meal__area')
  const mealImg = mealSection.querySelector('.meal__img')
  const mealIngredients = mealSection.querySelector('.meal__ingredients')
  const mealInstructions = mealSection.querySelector('.meal__instructions')
  const mealVideo = mealContainer.querySelector('.meal__video')
  const mealVideoContainer = mealContainer.querySelector('.video-container')

  mealName.innerText = meal.strMeal
  mealArea.innerText = meal.strArea
  mealImg.src = meal.strMealThumb
  mealImg.alt = meal.strMeal
  let ingredientLists = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')
  mealIngredients.innerHTML = ingredientLists
  mealInstructions.innerText = meal.strInstructions
  if (meal.strYoutube) {
    mealVideoContainer.style.display = 'block'
    mealVideo.src = `https://youtube.com/embed/${meal.strYoutube.slice(-11)}`
  } else {
    mealVideoContainer.style.display = 'none'
  }
}

searchForm.onsubmit = (e) => {
  e.preventDefault()
  showLoading()
  const searchInput = searchForm.querySelector('.search-input')
  let keyword = searchInput.value
  searchInput.blur()

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
    .then(res => res.json())
    .then(res => {
      searchMeals(res.meals)
      hideLoading()
    })
}

const searchMeals = (meals) => {
  if (meals) {
    mealCards.innerHTML = ''
    meals.forEach((meal) => {
      mealCards.innerHTML += `<div class="flex meal-card" id="meal-card" data-id="${meal.idMeal}" onclick="getMealById(this)">
      <img src="${meal.strMealThumb}" alt="Meal" class="image mr-1">
      <div class="flex column">
        <h3 class="name">${meal.strMeal}</h3>
        <p class="area text-gray">${meal.strArea}</p>
      </div>
    </div>`
    })
  } else {
    mealCards.innerHTML = `<p>Sorry, meal not found</p>`
  }
}

const getMealById = (el) => {
  showLoading()
  mealSection.classList.add('active')
  let mealId = el.getAttribute('data-id')

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(res => {
      getMeal(res.meals[0])
      hideLoading()
    })
}

searchButton.onclick = () => {
  showLoading()
  mealsSection.classList.add('active')
  searchForm.reset()

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    .then(res => res.json())
    .then(res => {
      searchMeals(res.meals)
      hideLoading()
    })
}

backButton1.onclick = () => {
  mealSection.classList.remove('active')
}

backButton2.onclick = () => {
  mealsSection.classList.remove('active')
}

function getElementById(id) {
  return document.getElementById(id);
}