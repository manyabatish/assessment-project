var index = 0;
var data = [];
const host = "https://api.edamam.com";
const appId = "4629df7d";
const apiKey = "a04da6cfd96bad9e15d82c5ce59d012a";

// Recipes
function getRecipes(query)
{
  $.ajax({
          url: `${host}/search?app_id=${appId}&app_key=${apiKey}&q=${query}`,
          success: function (result)
          {
            console.log(result);
            index = 0;
            data = result;
            loadRecipes(result);
          }
        });
}

function cleandata()
{
  document.getElementById("recipes").innerHTML="";
  document.getElementById("recipes").style="";
  document.getElementById("search-input").value="";
}

function kFormatter(num)
{
  return Math.abs(num) > 999 ?
  Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k" :
  Math.sign(num) * Math.abs(num);
}

function loadRecipes(result)
{
  let recipes = result.hits;
  $("#recipes").empty();
  recipes.forEach(recipe =>
  {
    $("#recipes").append(`<div class="recipe-card card" style="width: 18rem;">
        <a href="${recipe.recipe.url}" class="btn">
          <img src="${recipe.recipe.image}" class="card-img-top" alt="...">
        </a>
        <div class="card-body">
          <h5 class="card-title">${recipe.recipe.label}</h5>
          <p class="card-text">Calories: ${kFormatter(recipe.recipe.calories)}cal.</p>
          <button class="btn btn-success" onclick=openModalforIngredients(${index}) id="ingredientsbtn" data-toggle="modal" data-target="#mailModal">Ingredients</button>
          <button class="btn btn-success" onclick=openModalforNutrient(${index}) id="Nutrientbtn" data-toggle="modal" data-target="#mailModal">Nutrient</button>
        </div>
      </div>`
    );
    index++;
    $("#recipes").show();
  });
}

// Nutrition Analysis
function getNutrientsAnalysis(data)
{
  $.ajax({
          type: "POST",
          url: `https://api.edamam.com/api/nutrition-details?app_id=47379841&app_key=d28718060b8adfd39783ead254df7f92`, //`${host}/api/nutrition-details?app_id=${appId}&app_key=${apiKey}`,
          data: JSON.stringify(data),
          dataType: "json",
          contentType: "application/json",
          success: function (result)
          {
            console.log(result);
            loadAnalysis(result);
          }
        });
}

function loadAnalysis(result)
{
  $("#nutri-analysis").empty();
  let rowData = "";
  let ingredients = result.ingredients;
  ingredients.forEach(ingredient =>
  {
    let parsedData = ingredient.parsed[0];
    rowData += `<tr>
                  <th scope="row">${parsedData.quantity}</th>
                  <td>${parsedData.measure}</td>
                  <td>${parsedData.food}</td>
                  <td>${parsedData.weight}</td>
                </tr>`;
  });
  $("#nutri-analysis").append(`<table class="table">
                <thead>
                  <tr>
                    <th scope="col">Qty</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Food</th>
                    <th scope="col">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowData}
                </tbody>
              </table>`);
  $("#nutri-analysis").show();
}

// Pics
function getPics(query)
{
  $.ajax({
          url: `https://pixabay.com/api/?key=14364869-414b6dacd3d280678663edb95&q=${query}`,
          success: function (result)
          {
            loadPics(result);
          }
        });
}

function loadPics(result)
{
  let pics = result.hits;
  pics.forEach(pic =>
  {
    $("#pics").empty();
    $("#pics").append(`<div class="pic-card card" style="width: 18rem;">
          <img src="${pic.previewURL}" class="card-img-top" alt="...">
          <div class="card-body">
          <h5 class="card-title">${pic.user}</h5>
          <p class="card-text">Likes: ${pic.likes} | Views: ${pic.views}</p>
        </div>
      </div>`);
    $("#pics").show();
    });
}

$(document).ready(function ()
{
  // Get Recipes
  $("#search-button").click(function ()
  {
    let userQuery = $("#search-input").val();
    if (userQuery)
    {
      getRecipes(userQuery);
    }
  });
  $("#search-input").keypress(function (event)
  {
    let key = event.key ? event.key : event.which;
    if (key === "Enter")
    {
      let userQuery = $("#search-input").val();
      if (userQuery)
      {
        getRecipes(userQuery);
      }
    }
  });

  // Get Nutrient Analysis
  $("#analyse").click(function ()
  {
    let data = $("#ingredients-input").val();
    console.log(data);
    if (data)
    {
      data =
      {
        ingr: data.split(",")
      };
      console.log(data);
      getNutrientsAnalysis(data);
    }
  });

  // Get Nutrient Analysis
  $("#pic-search-button").click(function ()
  {
    let userQuery = $("#pic-search-input").val();
    if (userQuery)
    {
      getPics(userQuery);
    }
  });
  $("#pic-search-input").keypress(function (event)
  {
    let key = event.key ? event.key : event.which;
    if (key === "Enter")
    {
      let userQuery = $("#pic-search-input").val();
      if (userQuery)
      {
        getPics(userQuery);
      }
    }
  });
});

function openModalforIngredients(ind)
{
  document.getElementById("datare").innerHTML = "";
  var div1 = document.createElement("div");
  document.getElementById("mailheader").innerHTML = "Ingredients";
  for (var i = 0; i < data.hits[ind].recipe.ingredients.length; i++)
  {
    var p = document.createElement('p');
    p.innerHTML = data.hits[ind].recipe.ingredients[i].text;
    div1.append(p)
    console.log(p);
  }
  console.log(div1)
  document.getElementById("datare").append(div1);
}

function openModalforNutrient(ind)
{
  document.getElementById("datare").innerHTML = "";
  var div1 = document.createElement("div");
  document.getElementById("mailheader").innerHTML = "Nutrient";
  for (var i = 0; i < data.hits[ind].recipe.digest.length; i++)
  {
    var p = document.createElement('p');
    p.innerHTML = data.hits[ind].recipe.digest[i].label + " => " + data.hits[ind].recipe.digest[i].total;
    div1.append(p)
    console.log(p);
  }
  console.log(div1)
  document.getElementById("datare").append(div1);
}