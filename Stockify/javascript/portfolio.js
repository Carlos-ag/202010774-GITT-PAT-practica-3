// function checkForm() { //done in HTML
//     const symbol = document.getElementById("symbol");
//     const date = document.getElementById("form-portfolio-date");
//     const quantity = document.getElementById("form-portfolio-quantity");
//     const price = document.getElementById("form-portfolio-price");

// }


function handleFormSubmit ()  {
    // listener in the form submit button
    const submitButton = document.getElementById("form-portfolio-submit");
    const form = document.getElementById("form-portfolio");
    submitButton.addEventListener("click", function (event) {
        if (!form.checkValidity()){
            return false;
        }

        event.preventDefault();
    
        const symbol = document.getElementById("form-portfolio-symbol").value;
        const date = document.getElementById("form-portfolio-date").value;
        const quantity = document.getElementById("form-portfolio-quantity").value;
        const price = document.getElementById("form-portfolio-price").value;


        const table = document.getElementById("table-portfolio");
        const row = table.insertRow();
        const values = [date, symbol, quantity, price];

        for(let i = 0; i<values.length; i++){
            const cell = row.insertCell();
            cell.innerHTML = values[i];
        }

    });


}

handleFormSubmit();



