fetch("./data.json")
.then(resp => resp.json())
.then(data => programa(data))
.catch(err => console.log(err))

function programa(arrProductos) {
  var arrCarro=[]

  if (localStorage.getItem("carrito")) {
    arrCarro = JSON.parse(localStorage.getItem("carrito"))
  }
  if (arrCarro.length !=0) {
    agregaBt("compraron","Confirmar compra",comprarOn)
    agregaBt("mostCarr","Mostrar Carrito",verCarro1)
  }
  let logo = document.getElementById("logo")
  logo.innerHTML='<img src=https://i.postimg.cc/kG72b57s/logo-Surat.png>'
  let sectionProd = document.getElementById("secProd")
  let buscador = document.getElementById("buscador")
  buscador.onchange = filtrar
  let buscar = document.getElementById("buscar")
  buscar.onclick = filtrar
  
  let mostTodos = document.getElementById("logo")
  mostTodos.onclick = todosProductos
  todosProductos()

  function todosProductos(){
    renderTarjetas(arrProductos)
  }
  function filtrar() {
    let productosFiltrados = arrProductos.filter(producto => producto.nombre.toUpperCase().includes(buscador.value.toUpperCase())||producto.categoria.toUpperCase().includes(buscador.value.toUpperCase()))
    renderTarjetas(productosFiltrados)
  }
  function renderTarjetas(arrProductos) {
    sectionProd.innerHTML=""
    arrProductos.forEach(producto => {
      if(producto.stock > 0){
        let tarjetaProducto = document.createElement("div")
        tarjetaProducto.classList.add("tarjeta")
        tarjetaProducto.innerHTML=`
        <p>${producto.nombre}</p>
        <div id="contenedorImg"><img class="fotosProd" src=${producto.imgUrl}></div>
        <p>${producto.moneda+producto.precio}</p>
        <button id=${producto.id} class="bt">Agregar al carro</button>
        `
        if(producto.stock < 5){
          tarjetaProducto.classList.replace("tarjeta","bajoStock")
          let stockBajo = document.createElement("p")
          stockBajo.classList.add("ultimas")
          if (producto.stock == 1 ){
            stockBajo.innerText="Ultima unidad!"
          }
          else{
            stockBajo.innerText="Ultimas unidades!"}
            tarjetaProducto.appendChild(stockBajo)
          }
          sectionProd.append(tarjetaProducto)
          let agrAcarro = document.getElementById(producto.id)
          agrAcarro.onclick = agregaCarro
        }
      })
      tot()
      if (document.getElementById("mostTodos")) {
        quitaBt("mostTodos")
        agregaBt("mostCarr","Mostrar Carrito",verCarro1)
      }
      if (document.getElementById("mostCarr")&&arrCarro.length===0) {
        quitaBt("mostCarr")
        quitaBt("compraron")
      }
  }
  function agregaCarro(e) { 
    let productoBuscado = arrProductos.find(producto => producto.id == e.target.id)
    if (arrCarro.length===0) {
      agregaBt("compraron","Confirmar compra",comprarOn)
      agregaBt("mostCarr","Mostrar Carrito",verCarro1)
    }
    if (arrCarro.indexOf(productoBuscado) == -1) {
      arrCarro.push(productoBuscado);
      let prodCarro = arrCarro.find(producto => producto.id == e.target.id)
      prodCarro.cantidad = 1
      prodCarro.total = productoBuscado.cantidad*productoBuscado.precio
      toasty("Unidad agregada","#F2B705")
    }
    else if (arrCarro.indexOf(productoBuscado) != -1 && productoBuscado.cantidad<productoBuscado.stock){
      productoBuscado.cantidad++
      toasty("Unidad agregada","#F2B705")
    }
    else{
      toasty("Maxima cantidad cargada! (stock: "+productoBuscado.stock+")","rgb(188, 0, 0)")
    }
    localStorage.setItem("carrito", JSON.stringify(arrCarro))
    tot()
  }
  function verCarro1() {
    sectionProd.innerHTML=""
    arrCarro.forEach(producto => {
      let tarjetaProducto = document.createElement("div")
      tarjetaProducto.classList.add("tarjetaCompra")
      tarjetaProducto.innerHTML=`
      <p>${producto.nombre}</p>
      <div id="contenedorImg"><img class="fotosProd" src=${producto.imgUrl}></div>
      <p>Cantidad: ${Number(producto.cantidad)}</p>
      <p>Total:</p>
      <p>${producto.moneda+(producto.precio*producto.cantidad)}</p>
      <button id=${producto.id} class="bt" onclick=quitarCarro(${producto.id})>Quitar del carrito</button>
      `
      sectionProd.append(tarjetaProducto)
      let quitAcarro = document.getElementById(producto.id)
      quitAcarro.onclick = quitarCarro
    })
    if(document.getElementById("mostCarr")){
      quitaBt("mostCarr")
      agregaBt("mostTodos","Todos los productos",todosProductos)
    }
    if (arrCarro.length===0) {
    quitaBt("mostCarr")
    todosProductos()
    }
    tot()
  }

  function quitarCarro(e) {
    posProdBuscado = arrCarro.findIndex(producto => producto.id == e.target.id)
    if(arrCarro[posProdBuscado].cantidad > 1){
      arrCarro[posProdBuscado].cantidad--
      toasty("Unidad removida","rgb(188, 0, 0)")
      tot()
    }
    else {
      arrCarro.splice(posProdBuscado, 1)
      toasty("Producto eliminado","rgb(158, 0, 0)")
      tot()
    }
    localStorage.setItem("carrito", JSON.stringify(arrCarro))    
    if (arrCarro.length===0) {
      // quitaBt("compraron")
      // quitaBt("mostCarr")
      todosProductos()
    }
    else{
    verCarro1(arrCarro)
    tot()}
  }
  function comprarOn() {
    let tot = final()
    total(tot)
    arrCarro.forEach(producto => {
      quitaStock(producto.id)
    })
    arrCarro = []
    localStorage.removeItem("carrito")
    todosProductos()
  }
  function agregaBt(idBt, text, func) {
    let btCompra = document.createElement("button")
    btCompra.id=(idBt)
    btCompra.innerHTML=text
    let botones = document.getElementById("botones")
    botones.append(btCompra)
    let bt = document.getElementById(idBt)
    bt.onclick = func
  }
  function quitaBt(idBoton) {
    botones = document.getElementById("botones")
    bt = document.getElementById(idBoton)
    botones.removeChild(bt);
}
  function mostTotal(tot){
    let info = document.getElementById("info")
    info.innerHTML=""
    let textInfo = document.createElement("div")
    textInfo.innerHTML=`
    <p>El total de su carrito suma : $${tot}</p>`
    info.append(textInfo)
  }
  function total(tot) {
    alert("Gracias por su compra\n\nEl total a abonar es de: $ "+tot)
  }
  function final() {
    let tot=Number()
    arrCarro.forEach(producto => {
      tot += (producto.cantidad*producto.precio)
    })
    return tot
  }
  function tot() {
    let tot = final()
    mostTotal(tot)
  }
  function quitaStock(idq){
    let productoGral = arrProductos.find(productoBd => productoBd.id === idq)
    let prodCarro = arrCarro.find(producto => producto.id === idq)
    if(prodCarro.cantidad <= productoGral.stock){productoGral.stock=(productoGral.stock)-(prodCarro.cantidad)}
    else{alert("Confirmar compra, conflicto de stock renovado al actualizar")}
  }
  function toasty(text,background) {
    Toastify({
      text,
      className: "info",
      offset: {
        x: 30,
        y: 30,
      },
      style: {
        background,
      }
    }).showToast();
  }
}