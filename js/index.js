
    const qwerty = "qwertyuiopasdfghjklñzxcvbnm";
    const letrasMayusculas = qwerty.toUpperCase();
    const palabras = ["LUGAR", "HOJAS", "PERRO", "PLATO", "PAPEL"];

    let palabraSecreta = generarPalabra();
    let intentoActual = 1; //input-row
    let posicionActual = 0; //pos de los input dentro de input-row
    let inputIntentoClickeado = null;

    generarInterfazJuego();
    console.log(palabraSecreta);

    function generarPalabra() {
        return palabras[Math.floor(Math.random() * palabras.length)];
    }

    function generarInterfazJuego() {
        const inputMatrix = $("#input-matrix");
        generarInputMatriz(inputMatrix);
        $(document).off("click", ".input-box");    
    }

    //Matriz de inputs
    function generarInputMatriz(container) {
        for (let i = 1; i <= 6; i++) {
            const row = $("<div></div>");
            row.addClass("input-row intento" + i);
            container.append(row);

            for (let j = 0; j < 5; j++) {
                const inputBox = $("<input>");
                inputBox.attr("type", "text");
                inputBox.addClass("input-box pos" + j);
                inputBox.prop("readonly", true);
                row.append(inputBox);
            }
        }
        $(".intento" + intentoActual + " .input-box.pos0").css('border-color', 'lightblue');
        obtenerInputClickeado();
    }




    //Obtengo el input clickeado del intento actual
    function obtenerInputClickeado() {
        $(".intento" + intentoActual + " .input-box").on("click", function () {
            inputIntentoClickeado = $(this);
            console.log("ENTROOOOO");
            $(".intento" + intentoActual + " .input-box").css('border-color', '');
            $(this).css('border-color', 'lightblue');
        });
    }

    //Obtengo la letra clickeada y la agrego al input seleccionado
    $(".btn-teclado").on("click", function () {
        valorTecla = $(this).text();
        console.log(inputIntentoClickeado);

        if (inputIntentoClickeado) {
            inputIntentoClickeado.val(valorTecla);
            posicionActual = inputIntentoClickeado.index();
        } else {
            let primerInput = $(".intento" + intentoActual + " .input-box.pos0");
            primerInput.val(valorTecla);
            posicionActual = 0;
        }
        let valorSig = posicionActual+1;
        
        inputIntentoClickeado = $(".intento" + intentoActual + " .input-box.pos" + valorSig);
        $(".intento" + intentoActual + " .input-box").css('border-color', '');
        inputIntentoClickeado.css('border-color', 'lightblue');
    });

    

    const eliminarBtn = $(".btnTeclado.btn-eliminar");
    eliminarBtn.click(eliminarLetra);

    function eliminarLetra() {
        console.log(inputIntentoClickeado);
    
        if (inputIntentoClickeado) {
            let contenidoActual = inputIntentoClickeado.val();
            let posicionActual = inputIntentoClickeado.index();
    
            if (contenidoActual !== '') {
                inputIntentoClickeado.val('');
            } else {
                if (posicionActual > 0) {
                    let inputAnterior = $(".intento" + intentoActual + " .input-box.pos" + (posicionActual - 1));
                    inputIntentoClickeado = inputAnterior;
                    inputAnterior.val("");
                }
            }
    
            $(".intento" + intentoActual + " .input-box").css('border-color', '');
            inputIntentoClickeado.css('border-color', 'lightblue');
        }
    }

    
    const enviarBtn = $(".btnTeclado.btn-enviar");
    enviarBtn.click(enviarRespuesta);

    function enviarRespuesta() {
        let valoresFila = [];
    
        if (inputIntentoClickeado) {
            let contenedor = $(".intento" + intentoActual);
            contenedor.find('.input-box').each(function (index) {
                valoresFila.push($(this).val());
            });
    
            let valoresFilaClon = valoresFila.slice();
    
            for (let i = 0; i < valoresFilaClon.length; i++) {
                let letraIngresada = valoresFilaClon[i];
    
                // Verificar si la letra ingresada existe en alguna posición de la palabra secreta
                if (palabraSecreta.includes(letraIngresada)) {
                    // Obtener todas las posiciones en las que aparece la letra
                    let posiciones = [];
                    for (let j = 0; j < palabraSecreta.length; j++) {
                        if (palabraSecreta.charAt(j) === letraIngresada) {
                            posiciones.push(j);
                        }
                    }
    
                    // Verificar la posición correcta
                    if (posiciones.length > 0) {
                        let posicionCorrecta = posiciones.indexOf(i);
                        if (posicionCorrecta !== -1) {
                            console.log(letraIngresada + " en posición correcta en la palabra");
                            $(".intento" + intentoActual + " .input-box.pos" + i).css('background', 'green');
                        } else {
                            console.log(letraIngresada + " en posición incorrecta en la palabra");
                            $(".intento" + intentoActual + " .input-box.pos" + i).css('background', 'yellow');
                        }
                    }
                } else {
                    console.log(letraIngresada + " no existe en la palabra");
                    $(".intento" + intentoActual + " .input-box.pos" + i).css('background', 'gray');
                }
            }
    
            let palabraIngresada = valoresFila.join('');
            console.log("Palabra ingresada:", palabraIngresada);
            console.log("Palabra secreta:", palabraSecreta);
    
            if (palabraIngresada === palabraSecreta) {
                alert("¡Ganaste!");
            } else {
                intentoActual++;
                console.log(intentoActual);
                let siguienteFila = $(".intento" + intentoActual + " .input-box.pos0");
                siguienteFila.css('border-color', 'lightblue');
                inputIntentoClickeado = siguienteFila;
    
                obtenerInputClickeado();
            }
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
       
    
    
