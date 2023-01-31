var arrCarro=[]
const arrProductos=[
producto1={id:Number(1), nombre: "Jalea Ambar", categoria: "(Env. descartable)",moneda:"$", precio:Number(2380), stock:Number(20), imgUrl:"https://i.postimg.cc/zHXpktcj/jalAmb.png"},
producto2={id:Number(2), nombre: "Jalea Ambar", categoria: "(Env. Retornable)",moneda:"$", precio:Number(1890), stock:Number(10), imgUrl:"https://i.postimg.cc/qgj17rNZ/jal-Amb-Reto.png"},
producto3={id:Number(3), nombre: "Jalea Carmesi", categoria: "(Env. descartable)",moneda:"$", precio:Number(1870), stock:Number(1), imgUrl:"https://i.postimg.cc/Jt1Tm0zk/jalCarme.png"}
];

arrCarroJSON = JSON.stringify(arrCarro)
sessionStorage.setItem("carrito", "arrCarroJSON")
arrProductosJSON = JSON.stringify(arrProductos)
localStorage.setItem("productos", arrProductosJSON)

jsonArrProductos = localStorage.getItem("productos")
parseArrProductos = JSON.parse(jsonArrProductos)
// console.log(parseArrProductos);


let logo = document.getElementById("logo")
logo.innerHTML='<img src=https://i.postimg.cc/kG72b57s/logo-Surat.png>'
let sectionProd = document.getElementById("secProd")
let buscador = document.getElementById("buscador")
buscador.onchange = filtrar
let buscar = document.getElementById("buscar")
buscar.onclick = filtrar
let compraron = document.getElementById("compraron")
compraron.onclick = comprarOn
let mostCarro = document.getElementById("mostCarr")
mostCarro.onclick = verCarro1
let mostTodos = document.getElementById("mostTodos")
mostTodos.onclick = todosProductos
todosProductos()
// console.log(arrProductos);
// function todosProductos(){
//   renderTarjetas(arrProductos)
// }
function todosProductos(){
  renderTarjetas(arrProductos)
}
function filtrar() {
  let productosFiltrados = arrProductos.filter(producto => producto.nombre.toLocaleUpperCase().includes(buscador.value.toLocaleUpperCase())||producto.categoria.toLocaleUpperCase().includes(buscador.value.toLocaleUpperCase()))
  // console.log(productosFiltrados);
  renderTarjetas(productosFiltrados)
}
function renderTarjetas(arrProductosRender) {
  sectionProd.innerHTML=""
  arrProductosRender.forEach(producto => {
    if(producto.stock > Number(0)){
      let tarjetaProducto = document.createElement("div")
      tarjetaProducto.classList.add("tarjeta")
      tarjetaProducto.innerHTML=`
      <p>${producto.nombre}</p>
      <div id="contenedorImg"><img class="fotosProd" src=${producto.imgUrl}></div>
      <p>${producto.moneda+producto.precio}</p>
      <button id=${producto.id} class="bt">COMPRAR</button>
      `
      if(producto.stock < 5){
        tarjetaProducto.classList.add("bajoStock")
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
}
function agregaCarro(e) {
  let id = e.target.id
  let productoBuscado = arrProductos.find(producto => producto.id == id)
  Toastify({
    text: "Producto agregado a tu carrito",
    className: "info",
    offset: {
      x: 30,
      y: 63,
    },
    style: {
      background: "#F2B705",
    }
  }).showToast();
  if (arrCarro.indexOf(productoBuscado) == -1) {
    arrCarro.push(productoBuscado);
    productoBuscado.cantidad = Number(1)
    productoBuscado.total = Number(productoBuscado.cantidad*productoBuscado.precio)
  }
  else if (arrCarro.indexOf(productoBuscado) != -1 && productoBuscado.cantidad<productoBuscado.stock){
    productoBuscado.cantidad++
  }
    sessionStorage.setItem("carrito", JSON.stringify(arrCarro))
    // console.log(arrCarro.indexOf(productoBuscado));
    // console.log(arrCarro);
  }
function quitarCarro(id) {
  posProdBuscado = arrCarro.findIndex(producto => producto.id == id)
  if(arrCarro[posProdBuscado].cantidad > 1){
    arrCarro[posProdBuscado].cantidad--
  }
  else {
    arrCarro.splice(posProdBuscado, 1)
  }
  verCarro1(arrCarro)
  // console.log(e);
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
    <button id=${producto.id} class="bt" onclick=quitarCarro(${producto.id})>Eliminar del carrito</button>
    `
    sectionProd.append(tarjetaProducto)
  })
}
function comprarOn() {
  arrCarro.forEach(producto => {
    quitaStock(producto.id)
    arrCarro = []
    sessionStorage.clear()
    todosProductos()
  })
}
function quitaStock(idq){
  arrCarro.find(producto => {
    let productoGral = arrProductos.find(producto => producto.id == idq)
      if((producto.cantidad) <= productoGral.stock){productoGral.stock=(productoGral.stock)-(producto.cantidad)
      localStorage.setItem("productos", JSON.stringify(arrProductos))
      final()
      arrCarro.shift(producto)
      verCarro1()
    }
  })
}
function final() {
  let tot=Number()
  arrCarro.forEach(producto => {
    tot += (producto.cantidad*producto.precio)
  })
  alert("Gracias por su compra\n\nEl total a abonar es de: $ "+tot)
}