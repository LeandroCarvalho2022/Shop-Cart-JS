if(document.readyState == "loading"){ //Verificação feita para que caso o HTML carregue depois que o JS, ele não execute o codigo, para nao gerar erro
    document.addEventListener("DOMContentLoaded", ready)
} else {
    ready()
}

var totalAmout = "0,00"

function ready(){
    const removeProductButtons = document.getElementsByClassName("button-remover-prod")
    for (var  i = 0; i < removeProductButtons.length; i++){
    removeProductButtons[i].addEventListener("click", removeProduct)}

    const quantityInputs = document.getElementsByClassName("prod-qtd-input")
    for (var i = 0; i < quantityInputs.length; i++ ){
        quantityInputs[i].addEventListener("change", checkIfInputIsNull)
    }

    const addToCartButtons = document.getElementsByClassName("button-hover-background")
    for (var i = 0; i < addToCartButtons.length; i++){
        addToCartButtons[i].addEventListener("click", addProductToCart)
    }

    const purchaseButton = document.getElementsByClassName("botao-comprar")[0]
    purchaseButton.addEventListener("click", makePurchase)
}




function makePurchase(){//função criada para a funcionalidade do button "botao-comprar", que finaliza a compra, condicional para que se o carrinho esteja vazio dispara a mensagem de que o carrinho está vazio e nao deixa prosseguir a compra.
    //Else dispara o alerta contabilizando o preço total do pedido e uma mensagem de agradecimento.
    if(totalAmout == "0,00"){
        alert("Seu carrinho está vazio!")
    } else {
        alert(//crase é utilizada para chamar variavel dentro da STR.       
            `
            Obrigado pela sua compra <3
            Valor do pedido: R$${totalAmout}
            Volte sempre, a Capítulo certo agradece! 
            `
        )
    }

    document.querySelector(".table-carrin tbody").innerHTML = ""//Funcionalidade para resetar o carrinho assim que a compra for finalizada
    updateTotal();
}


//função para retirar produto do carrinho caso o valor do input de qtd_prod  seja igual a 0.
function checkIfInputIsNull(event){
    if (event.target.value == "0"){//event target para pegar o input, condicional da funcionalidade
        event.target.parentElement.parentElement.remove();// acesso ao elemento pai do input, e função remove para remover do JS.
    }
    updateTotal()

}

function addProductToCart(event){
    const button = event.target
    const productInfos = button.parentElement.parentElement
    const prodImage = productInfos.getElementsByClassName("product-imagem")[0].src //Acessado posicao 0 do elemento que e onde fica a img, 
    //.src utilizado para pegar a url da imagem para coloca-lá no carrinho. 
    const productTitle = productInfos.getElementsByClassName("product-titulo")[0].innerText // inner txt para pegar somente o nome do produto
    const productPrice = productInfos.getElementsByClassName("product-preco")[0].innerText
    
    const productsCartName = document.getElementsByClassName("titulo-prod-carrin")
    for (var i = 0; i< productsCartName.length; i++){
        if (productsCartName[i].innerText == productTitle){
            productsCartName[i].parentElement.parentElement.getElementsByClassName("prod-qtd-input")[0].value++
            return//return utilizado para sair da funcao newcarproduct para que ele apenas incremente um valor a mais no carrinho e nao adicione outro produto.
        }
    }

    let newCartProduct = document.createElement("tr")//Criado elemento TR, com let pois o valor será mudado
    newCartProduct.classList.add("podruto-carrin")//Aq a classe que será add ao elmento tr está defininda.

    newCartProduct.innerHTML = 
    `
        <td class="identificacion-produto">
            <img src="${prodImage}" alt="${productTitle}" class="imagem-prod-carrin">
            <strong class="titulo-prod-carrin">${productTitle}</strong>
        </td>
        <td>
            <span class="preco-prod-carrin">${productPrice}</span>
        </td>
        <td>
            <input type="number" value="1" min="0" class="prod-qtd-input">
            <button type="button" class="button-remover-prod">Remover</button>
        </td>
    ` 
//innerHTML, foi utilizado para informar que dentro do elemento TR terá essas informacoes.
//Para que funcione a lógica foi necessário alocar dentro dos valores de cada item do elemento TR que continham dados do produto
// as variáveis da funcao 'addProductToCart', para que assim que o event do button de adicionar fosse acionado ele automaticamente puxasse para o elemnto tr o dado do prduto específico.
    
//variavel criada para mostrar o produto no carrinho. metodo append reponsavel por adicionar o elemento tr criado
    const tableBody = document.querySelector(".table-carrin tbody")
    tableBody.append(newCartProduct)

    updateTotal()
    newCartProduct.getElementsByClassName("prod-qtd-input")[0].addEventListener("change", checkIfInputIsNull)
    newCartProduct.getElementsByClassName("button-remover-prod")[0].addEventListener("click", removeProduct)
    //Funcionalidade criada para que todo item novo que seja adicionado ao carrinho tenha as funcionalidades necessarias para, adicionar mais de um produto e contabilizar no total, e que o button remove remova o produto do carrinho.
}


function removeProduct(event) {
    event.target.parentElement.parentElement.remove()
    updateTotal()
}

function updateTotal(){
    totalAmout = 0
    const cartProducts = document.getElementsByClassName("podruto-carrin")
    for (var i = 0; i < cartProducts.length; i++) {
        const productPrice = cartProducts[i].getElementsByClassName("preco-prod-carrin")[0].innerText.replace("R$", "").replace(",", ".")  //innertext utilizado pra pegar somente o numero da classe
        // replace utilizado para retirar o dado R$, e no lugar dele será colocado a string vazia, mostrando somente os numeros
        //Para fazer a soma o JS somente entende numeros com ponto, então foi trocado também a virgula por ponto com o replace
        const productQtd = cartProducts[i].getElementsByClassName("prod-qtd-input")[0].value //value pegará somente a qtd dentro da classe prodqtdinput
        totalAmout += productPrice * productQtd
    }
    totalAmout = totalAmout.toFixed(2)//função toFixed utilizada para mostrar apenas 2 numeros da casa decimal do total da compra.
    totalAmout = totalAmout.replace(".", ",")
    document.querySelector(".container-sald-devedor span").innerHTML = "R$" + totalAmout;
}
