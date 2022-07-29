window.addEventListener('DOMContentLoaded', () => {
    let comenzar = document.getElementById("comenzar")
    let topPuntajes = document.getElementById("topPuntajes")
    let tiempo = document.getElementById("tiempo")
    let pregunta = document.getElementById("pregunta")
    let respuestas = document.getElementById("respuestas")
    let cardFinal = document.getElementById("cardFinal")
    let formMarcador = document.getElementById("formMarcador")
    let cajaNombre = document.getElementById("name")
    let listaPuntajes = document.getElementById("listaPuntajes")
    let desafio = document.getElementById("desafio")
    let cajaTiempo = document.getElementById("cajaTiempo")
    let inputNombre = document.getElementById("inputNombre")
    let volverAtras = document.getElementById("volverAtras")
    let borrarPuntajes = document.getElementById("borrarPuntajes")
    let preguntaActual = 0
    let cuentaRegresiva = 15
    let puntaje = 0
    let nombre = ""
    let reloj
    let marcador = []

    if(localStorage.getItem("marcador")){
        marcador = JSON.parse(localStorage.getItem("marcador"))
    }else{
        localStorage.setItem("marcador", JSON.stringify(marcador))
    }

    comenzar.addEventListener("click", comenzarTrivia)
    topPuntajes.addEventListener("click",mostrarMarcador)
    borrarPuntajes.addEventListener("click",function(){
        listaPuntajes.innerHTML = ""
        marcador = []
        localStorage.setItem("marcador", JSON.stringify(marcador))
    })
    formMarcador.addEventListener("submit", function (e) {
        e.preventDefault()
        nombre = cajaNombre.value.trim()
        cajaNombre.value = ""
        escribirPuntaje()
        formMarcador.style.display = "none"
    })

    function escribirPuntaje() {
        listaPuntajes.innerHTML = ""
        marcador.push({
            nombre: nombre, puntaje: puntaje
        })
        localStorage.setItem("marcador", JSON.stringify(marcador))
        mostrarMarcador()
    }

    function mostrarMarcador() {
        marcador = JSON.parse(localStorage.getItem("marcador"))
        marcador.sort((a,b) => (a.puntaje < b.puntaje) ? 1 : -1)
        console.log(marcador)
        if(!marcador.length){
            let li = document.createElement("li")
            li.textContent = "No hay puntajes todavía"
            listaPuntajes.appendChild(li)
        }

        let lon
        if(marcador.length < 10){ lon =  marcador.length
        }else{ lon = 10 }
        
        for(let i = 0; i < lon; i++){
            let li = document.createElement("li")
            let span1 = document.createElement("span")
            let span2 = document.createElement("span")

            li.textContent = (i+1) + ". "
            li.appendChild(span1)
            li.appendChild(span2)
            
            span1.innerHTML = marcador[i].nombre
            span2.innerHTML = marcador[i].puntaje

            li.setAttribute("index", i)
            listaPuntajes.appendChild(li)
        }
        
        listaPuntajes.style.display = "block"
        topPuntajes.style.display = "none"
    }

    function comenzarTrivia() {
        comenzar.style.display = "none"
        desafio.innerHTML = ""
        topPuntajes.style.display = "none"
        cajaTiempo.style.display = "block"
        listaPuntajes.style.display = "none"

        setearTiempo()
        mostrarPregunta()
        mostrarRespuestas()
    }

    function setearTiempo() {
        tiempo.textContent = cuentaRegresiva
        clearInterval(reloj)

        reloj = setInterval(function () {
            cuentaRegresiva--
            tiempo.textContent = cuentaRegresiva
            if (cuentaRegresiva < 1) {
                clearInterval(reloj)
                if (preguntaActual < 4) {
                    proxPregunta()
                    cuentaRegresiva = 15
                } else {
                    terminarTrivia()
                }
            }
        }, 1000)
    }

    function proxPregunta() {
        preguntaActual++
        mostrarPregunta()
        mostrarRespuestas()
        setearTiempo()
    }

    function mostrarPregunta() {
        pregunta.textContent = preguntas[preguntaActual].titulo
    }


    function mostrarRespuestas() {
        respuestas.innerHTML = ""
        for (let i = 0; i < 4; i++) {
            let li = document.createElement("li")
            li.textContent = (i + 1) + ". " + preguntas[preguntaActual].alternativas[i]
            li.setAttribute("index", i)
            li.addEventListener("click", valorRespuesta)
            respuestas.append(li)
        }
    }

    function valorRespuesta() {
        let broken = this.textContent.split(" ")

        if (broken[1] == preguntas[preguntaActual].respCorrecta) {
            puntaje += cuentaRegresiva
            cuentaRegresiva = 15
        } else{
            cuentaRegresiva = 10
        }

        if (preguntaActual < 4) {
            proxPregunta()
        } else {
            terminarTrivia()
        }
    }

    function terminarTrivia() {
        pregunta.innerHTML = ""
        respuestas.innerHTML = ""
        cajaTiempo.style.display = "none"
        volverAtras.style.display = "block"
        borrarPuntajes.style.display = "block"
        clearInterval(reloj)
        cardFinal.textContent = "Puntaje: " + puntaje
        inputNombre.textContent = "Ingrese su nombre"
        formMarcador.style.display = "block"
    }
})