
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
        // console.log(inputIntentoClickeado);

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
        let letras = {};    
        // Crear objeto letras con posiciones, cantidad, utilizados y disponibilidad
        for (let i = 0; i < palabraSecreta.length; i++) {
            let letra = palabraSecreta[i];
    
            if (!letras[letra]) {
                letras[letra] = { posiciones: [i], cantidad: 1, utilizados: 0, disponible: true };
            } else {
                letras[letra].posiciones.push(i);
                letras[letra].cantidad++;
            }
        }
        console.log("LETRAS 1:"+letras);
        // Copiar el objeto letras antes de las iteraciones
        let letrasOriginal = JSON.parse(JSON.stringify(letras));


        
    if (inputIntentoClickeado) {
        let contenedor = $(".intento" + intentoActual);    
       
        // Iteración 1: busca solo las letras que coinciden en la posicion, y las marca verde
        contenedor.find('.input-box').each(function (index) {
        
        let letraIngresada = $(this).val();
        let letraSecreta = palabraSecreta.charAt(index);       
        if (letraIngresada === letraSecreta) {
            if (!$(this).hasClass('verde')) {
                $(this).css('background', 'green').addClass('verde');
                
                //pongo el color del teclado en verde
                let letraBoton = letraIngresada.toLowerCase();
                $('#teclado .btn-teclado.' + letraBoton).css('background', 'green').addClass('verde');
                
                
                let letraEnLetras = letras[letraIngresada];
                if (letraEnLetras && letraEnLetras.disponible) {
                    letraEnLetras.utilizados++; 
                    //si esta disponible, le sumo 1 a utilizada (sino por mas que la letra exista se marca como gris en la 3ra iteracion, 
                    //pq puede que en otra posicion este la letra, y la tome como valida, 
                    //pero despues puede venir una correcta y no se marcaria pq ya marco una anterior. Entonces 1 iteracion solo marca las verdes)
                    if (letraEnLetras.utilizados >= letraEnLetras.cantidad) {
                        letraEnLetras.disponible = false; 
                        //si ya estan utilizadas las disponibles, se pone como false para que en otras iteraciones si encuentra la letra, se pone como gris.
                    }
                }
            }
        }
    });

    
            // Iteración 2: busca letras que existan pero no coincida la posicion, y las marca de amarillo. (siempre que esten disponibles, sino gris)
            contenedor.find('.input-box').each(function (index) {
                let letraIngresada = $(this).val();
                let letraEnLetras = letras[letraIngresada];
                //si existe && no coincide la posicion && esta disponible && y no fue marcada como posicion correcta en verde (sino marcaria la correcta como amarillo)
                if (letraEnLetras && !letraEnLetras.posiciones.includes(index) && letraEnLetras.disponible && !$(this).hasClass('verde')) {
                    if (!$(this).hasClass('amarillo')) {
                        $(this).css('background', 'yellow').addClass('amarillo');
                        
                            let letraBoton = letraIngresada.toLowerCase();
                            //pongo el color del teclado en amarillo si no tiene la clase verde
                            //puede tener verde, y amarillo en la matriz (en el teclado solo hay 1 letra, se prioriza la verde)
                            if(!$('#teclado .btn-teclado.' + letraBoton).hasClass('verde')) {
                                $('#teclado .btn-teclado.' + letraBoton).css('background', 'yellow').addClass('amarillo');
                            }

                            //si quedo alguna disponible no marcada como verde, y la voy a utilzar, sumo 1 en utilzados, asi si hay otra se marca como gris
                            if (letraEnLetras.disponible) {
                            letraEnLetras.utilizados++;
                            if (letraEnLetras.utilizados >= letraEnLetras.cantidad) {
                                letraEnLetras.disponible = false;
                            }
                        }
                    }
                }
            });
    
            // Iteración 3: busca letras que no existan, o que si pero no esten disponibles, marca en gris
            contenedor.find('.input-box').each(function (index) {
                let letraIngresada = $(this).val();
                let letraEnLetras = letras[letraIngresada];
            
                if (letraEnLetras) {
                     //si no esta disponible && no tiene clase ni verde ni amarillo
                     //puede que no este disponible, pero que en las iteraciones anteriores se marcaron como verde/amarillo
                     //si no preguntamos la clase, lo verde/amarillo lo marca como gris
                    if (!letraEnLetras.disponible && !$(this).hasClass('verde') && !$(this).hasClass('amarillo')) {
                        $(this).css('background', 'gray').addClass('gris');

                        //si la letra no existe marcamos el teclado en gris
                        let letraBoton = letraIngresada.toLowerCase();
                        $('#teclado .btn-teclado.' + letraBoton).css('background', 'grey').addClass('gris');
                        
                    }
                } else if (!$(this).hasClass('verde') && !$(this).hasClass('amarillo')) {
                    $(this).css('background', 'gray').addClass('gris marcado');

                    //si la letra no existe marcamos el teclado en gris
                    let letraBoton = letraIngresada.toLowerCase();
                    $('#teclado .btn-teclado.' + letraBoton).css('background', 'grey').addClass('gris');
                }
            });
    
            let palabraIngresada = contenedor.find('.input-box').toArray().map(input => $(input).val()).join('');
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
    
            // Una vez iterado 3 veces (3 colores), vuelvo al objeto original, asi puedo iterar
            //por cada fila(intento) sin que cuenten los intentos anteriores (no se pisan)
            letras = letrasOriginal;
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
       
    
    
