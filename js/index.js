
  "use strict";
    let cantidadLetras = 0;
    let palabras = ""; //arreglo de palabras
    let palabraSecreta = "";
    let totalPalabrasAcertadas = 0;
    let modoJuego = "";
    let palabraSecretaEmoji = "";

    // Modo de juego
    let modoPalabras = 'palabras';
    let modoEmojis = 'emojis';
    let modoFechas = 'fechas';

    function iniciarJuego(modo, ndificultad) {
        modoJuego= modo;
        intentoActual = 1;
        posicionActual = 0;
        palabraSecretaEmoji = "";

        if(modo == modoPalabras) {
            cantidadLetras = ndificultad;
                if(ndificultad == 4) {
                palabras = palabras4Letras;
                } else if( ndificultad == 5) {
                    palabras = palabras5Letras;
                } else if( ndificultad == 6) {
                    palabras = palabras6Letras;
                } else if( ndificultad == 5) {
                    palabras = palabras7Letras;
                }
                $('#tecladoEmojis').css('display', 'none');
                $('#tecladoPalabras').css('display', 'block');

                palabraSecreta = generarPalabra(palabras);

        } else if (modo == modoEmojis) {
            cantidadLetras = ndificultad;
            palabras = [ 
                "q", "w", "e", "r", "t",
                "a", "s", "d", "f", "g",
                "z", "x", "c", "v", "b"
            ]
            palabraSecreta = generarPalabraEmoji(palabras);

            //obtengo el valor de la palabra en emoji, para mostrar en el modal rendiste/perdiste
            for (let i = 0; i < palabraSecreta.length; i++) {
                let letra = palabraSecreta[i];
                let letraEmoji = obtenerValorEmojiLetra(letra);           
                palabraSecretaEmoji += letraEmoji;
            }
            
            $('#tecladoPalabras').css('display', 'none');
            $('#tecladoEmojis').css('display', 'block');

        }else if (modo == modoFechas) {

        }
        $('.center-container').css('display', 'none'); //saco menu
        $('.contenedor-juego').css('display', 'block');//muestro juego
        generarInterfazJuego();
        
       
        // console.log(palabraSecreta);
    }

    let intentoActual = 1; //input-row
    let maximo_intento = 6;
    let posicionActual = 0; //pos de los input dentro de input-row
    let inputIntentoClickeado = null;


    function generarPalabra(palabras) {
        return palabras[Math.floor(Math.random() * palabras.length)];
    }

    function generarPalabraEmoji(emojis) {
        let palabraGenerada = '';
        
        for (let i = 0; i < cantidadLetras; i++) {
            let emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
            palabraGenerada += emojiAleatorio;
        }
    
        return palabraGenerada;
    }

    function generarInterfazJuego() {
        let inputMatrix = $("#input-matrix");
        inputMatrix.empty();
        generarInputMatriz(inputMatrix);
        $(document).off("click", ".input-box");    
    }

    //Matriz de inputs
    function generarInputMatriz(container) {
        for (let i = 1; i <= 6; i++) {
            let row = $("<div></div>");
            row.addClass("input-row intento" + i);
            container.append(row);

            for (let j = 0; j < cantidadLetras; j++) {
                let inputBox = $("<input>");
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
            $(".intento" + intentoActual + " .input-box").css('border-color', '');
            $(this).css('border-color', 'lightblue');
        });
    }

    //Obtengo la letra clickeada y la agrego al input seleccionado
    $(".btn-teclado").on("click", function () {
        let valorTecla = "";
        valorTecla = $(this).text();
        // console.log(valorTecla);

        if (inputIntentoClickeado) {
            inputIntentoClickeado.val(valorTecla).addClass('efecto-input-letra');
            posicionActual = inputIntentoClickeado.index();
        } else {
            let primerInput = $(".intento" + intentoActual + " .input-box.pos0");
            primerInput.val(valorTecla).addClass('efecto-input-letra');
            posicionActual = 0;
        }
        let valorSig = posicionActual+1;
        
        inputIntentoClickeado = $(".intento" + intentoActual + " .input-box.pos" + valorSig);
        $(".intento" + intentoActual + " .input-box").css('border-color', '');
        inputIntentoClickeado.css('border-color', 'lightblue');
    });

    

    let eliminarBtn = $(".btnTeclado.btn-eliminar");
    eliminarBtn.click(eliminarLetra);

    function eliminarLetra() {
    
        if (inputIntentoClickeado) {
            let contenidoActual = inputIntentoClickeado.val();
            let posicionActual = inputIntentoClickeado.index();
    
            if (contenidoActual !== '') {
                inputIntentoClickeado.val('').removeClass('efecto-input-letra');;
            } else {
                if (posicionActual > 0) {
                    let inputAnterior = $(".intento" + intentoActual + " .input-box.pos" + (posicionActual - 1));
                    inputIntentoClickeado = inputAnterior;
                    inputAnterior.val("").removeClass('efecto-input-letra');;
                }
            }
    
            $(".intento" + intentoActual + " .input-box").css('border-color', '');
            inputIntentoClickeado.css('border-color', 'lightblue');
        }
    }

    
    let enviarBtn = $(".btnTeclado.btn-enviar");
    enviarBtn.click(enviarRespuesta);

   async function enviarRespuesta() {        
        //verifico si no hay inputs vacios
        let inputsVacios = $('.intento' + intentoActual + ' .input-box').filter(function () {
            return $(this).val().trim() === '';
        });
        
        if (inputsVacios.length > 0) {
            mostrarAlerta('Completa todos los campos', 'warning');
        } else {
            //si no hay inputs vacios sigo con la logica del juego
            $('.alert').css('display', 'none');

            let letras = {};  
            //objeto letras con posiciones, cantidad, utilizados y disponibilidad
            // console.log(palabraSecreta)
        for (let i = 0; i < palabraSecreta.length; i++) {
            let letra = palabraSecreta[i];
    
            if (!letras[letra]) {
                letras[letra] = { posiciones: [i], cantidad: 1, utilizados: 0, disponible: true };
            } else {
                letras[letra].posiciones.push(i);
                letras[letra].cantidad++;
            }
        }
        // console.log(letras)

        //copiar el objeto letras antes de las iteraciones
        let letrasOriginal = JSON.parse(JSON.stringify(letras));

    if (inputIntentoClickeado) {
        let contenedor = $(".intento" + intentoActual);    
       
        // Iteración 1: busca solo las letras que coinciden en la posicion, y las marca verde
        contenedor.find('.input-box').each(function (index) {
            let letraIngresada = "";
            if(modoJuego == modoEmojis) {
                letraIngresada = obtenerValorEmojiLetra($(this).val());
            }
        else if (modoJuego == modoPalabras) {
            letraIngresada = $(this).val();
        }
        // console.log(letraIngresada)
        let letraSecreta = palabraSecreta.charAt(index);  
        // console.log(letraSecreta);     
        if (letraIngresada === letraSecreta) {
            if (!$(this).hasClass('verde')) {
                $(this).addClass('verde');
                
                //pongo el color del teclado en verde
                let letraBoton = letraIngresada.toLowerCase();
                $('.btn-teclado.' + letraBoton).addClass('verde');
                
                
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
        mostrarAnimacionLetrasInout(this);
        // $(this).addClass('flip-animation');
    });

    
            // Iteración 2: busca letras que existan pero no coincida la posicion, y las marca de amarillo. (siempre que esten disponibles, sino gris)
            contenedor.find('.input-box').each(function (index) {
                let letraIngresada = "";
                if(modoJuego == modoEmojis) {
                    letraIngresada = obtenerValorEmojiLetra($(this).val());
                }
            else if (modoJuego == modoPalabras) {
                letraIngresada = $(this).val();
            }
                let letraEnLetras = letras[letraIngresada];
                //si existe && no coincide la posicion && esta disponible && y no fue marcada como posicion correcta en verde (sino marcaria la correcta como amarillo)
                if (letraEnLetras && !letraEnLetras.posiciones.includes(index) && letraEnLetras.disponible && !$(this).hasClass('verde')) {
                    if (!$(this).hasClass('amarillo')) {
                        $(this).addClass('amarillo');
                        
                            let letraBoton = letraIngresada.toLowerCase();
                            //pongo el color del teclado en amarillo si no tiene la clase verde
                            //puede tener verde, y amarillo en la matriz (en el teclado solo hay 1 letra, se prioriza la verde)
                            if(!$('.btn-teclado.' + letraBoton).hasClass('verde')) {
                                $('.btn-teclado.' + letraBoton).addClass('amarillo');
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
                mostrarAnimacionLetrasInout(this);
                // $(this).addClass('flip-animation');
            });
    
            // Iteración 3: busca letras que no existan, o que si pero no esten disponibles, marca en gris
            contenedor.find('.input-box').each(function (index) {
                let letraIngresada = "";
                if(modoJuego == modoEmojis) {
                    letraIngresada = obtenerValorEmojiLetra($(this).val());
                }
                else if (modoJuego == modoPalabras) {
                    letraIngresada = $(this).val();
                }
                let letraEnLetras = letras[letraIngresada];
            
                if (letraEnLetras) {
                     //si no esta disponible && no tiene clase ni verde ni amarillo
                     //puede que no este disponible, pero que en las iteraciones anteriores se marcaron como verde/amarillo
                     //si no preguntamos la clase, lo verde/amarillo lo marca como gris
                    if (!letraEnLetras.disponible && !$(this).hasClass('verde') && !$(this).hasClass('amarillo')) {
                        $(this).addClass('gris');
                        //si la letra no existe marcamos el teclado en gris
                        let letraBoton = letraIngresada.toLowerCase();
                        
                        //solo pongo gris el teclado, si no tiene ningun color
                        //ej: si la letra M estaba en verde, y en la otra linea la pongo en otro lado y se pone en amarillo, en el teclado sigue verde
                        if (!$('.btn-teclado.' + letraBoton).hasClass('verde') && !$('.btn-teclado.' + letraBoton).hasClass('amarillo')) {
                            $('.btn-teclado.' + letraBoton).addClass('gris');
                        }
                        
                    }
                }                 
                else if (!$(this).hasClass('verde') && !$(this).hasClass('amarillo')) {            
                    //si la letra no existe marcamos el teclado en gris
                    let letraBoton = letraIngresada.toLowerCase();
                    $('.btn-teclado.' + letraBoton).addClass('gris');
                    $(this).addClass('gris');
                }
                mostrarAnimacionLetrasInout(this);
                // $(this).addClass('flip-animation');
            });

            let palabraIngresada = ""; //modo palabras
            let palabraIngresadaEmoji = ""; //modo emojis
            let palabraSecretaModoJuego = ""; //si el modo es emoji, te muestra emojis en el modal, sino letras
            if(modoJuego == modoEmojis) {
                palabraIngresada = contenedor.find('.input-box').toArray().map(input => obtenerValorEmojiLetra($(input).val())).join('');
                palabraIngresadaEmoji =  contenedor.find('.input-box').toArray().map(input => $(input).val()).join(''); //guardo los emojis para mostrar en el modal al finalziar
                palabraSecretaModoJuego = palabraIngresadaEmoji;
            } else if (modoJuego == modoPalabras) {
                palabraIngresada = contenedor.find('.input-box').toArray().map(input => $(input).val()).join('');
                palabraSecretaModoJuego = palabraSecreta;
            }
            console.log(palabraIngresadaEmoji, palabraSecreta);
            if (palabraIngresada === palabraSecreta) {
                totalPalabrasAcertadas++;
                $('.modal_resultado .modal-title').text('¡Ganaste!');
                mostrarAlerta('¡Ganaste! 🏆', 'success');
                confetti();               
                $('.modal_resultado .modal-body .palabra-era').html('<p>La palabra era:</p><p class="font-weight-bold text-uppercase psecreta-modal">' + palabraSecretaModoJuego + '</p>');                if (totalPalabrasAcertadas > 0) {
                    $('.modal_resultado .modal-body .total-conseguido').html('<p>Llevas un total de: <strong>' + totalPalabrasAcertadas + '</strong> palabras acertadas consecutivas</p>');
                }                
                $('.modal_resultado .btn-primary').removeClass('restart').addClass('siguiente').html('Siguiente palabra');
                setTimeout(() => {
                    $('.modal_resultado').modal({
                        backdrop: false
                    });
                    $('.modal_resultado').modal('show');
                }, 3000);
            } else if (intentoActual < maximo_intento) {
                intentoActual++;
                let siguienteFila = $(".intento" + intentoActual + " .input-box.pos0");
                siguienteFila.css('border-color', 'lightblue');
                inputIntentoClickeado = siguienteFila;
                obtenerInputClickeado();
            } else if (intentoActual == maximo_intento) {
                mostrarAlerta('¡Perdiste!', 'danger')
                $('.modal_resultado .modal-title').text("¡Perdiste!");
                if(modoJuego == modoEmojis) {
                    $('.modal_resultado .modal-body .palabra-era').html('<p>La palabra era:</p><p class="font-weight-bold text-uppercase psecreta-modal">' + palabraSecretaEmoji + '</p>');
                }
                else if (modoJuego == modoPalabras) {
                    $('.modal_resultado .modal-body .palabra-era').html('<p>La palabra era:</p><p class="font-weight-bold text-uppercase psecreta-modal">' + palabraSecreta + '</p>');
                }
                if (totalPalabrasAcertadas >= 0) {
                    $('.modal_resultado .modal-body .total-conseguido').html('<p>Conseguiste un total de: <strong>' + totalPalabrasAcertadas + '</strong> palabras acertadas consecutivas</p>');
                    $('.modal_resultado .btn-primary').removeClass('siguiente').addClass('restart').html('Reiniciar');
                }
                setTimeout(() => {
                    $('.modal_resultado').modal('show');
                }, 800);
            }                
    
            // Una vez iterado 3 veces (3 colores), vuelvo al objeto original, asi puedo iterar
            //por cada fila(intento) sin que cuenten los intentos anteriores (no se pisan).
            letras = letrasOriginal;
            }
        }

    }


    function obtenerValorEmojiLetra(valor) {
        let emojiToLetter = {
            '🦊': 'q',
            '🐷': 'w',
            '🐶': 'e',
            '🐰': 'r',
            '😺': 't',
            '🐸': 'a',
            '🐯': 's',
            '🐙': 'd',
            '🐨': 'f',
            '🐳': 'g',
            '🦄': 'z',
            '🐹': 'x',
            '🐮': 'c',
            '🐥': 'v',
            '🐼': 'b',
        };

        if (valor in emojiToLetter) {
            //Si esta, quiere decir que es un emoji, devuelvo el valor
            return emojiToLetter[valor];
        } else {
            // si no esta, es una letra, devuelvo la clave (emoji)
            let letraToEmoji = Object.entries(emojiToLetter).find(entry => entry[1] === valor);
            if (letraToEmoji) {
                return letraToEmoji[0];
            } else {
                // Si no se encuentra una coincidencia, devolver el mismo valor
                return valor;
            }
    }
}


    function mostrarAlerta(mensaje, tipo) {
        let alerta = $('.alert');
        alerta.text(mensaje);
        alerta.removeClass('alert-danger alert-success').addClass(`alert-${tipo}`);
        alerta.css('display', 'block');
    }

    async function confetti() {
        import('https://cdn.skypack.dev/canvas-confetti').then((confetti) => {
            confetti.default();
        });
    }

    $(document).on('click', '.restart', function () {
        $('.modal_resultado').modal('hide');
        $('.btn-teclado').css('background', '#e5ecf4').removeClass('amarillo verde gris');
        totalPalabrasAcertadas = 0;
        iniciarJuego(modoJuego, cantidadLetras);
    });
    
    $(document).on('click', '.siguiente', function () {
        $('.modal_resultado').modal('hide');
        $('.btn-teclado').css('background', '#e5ecf4').removeClass('amarillo verde gris');
        iniciarJuego(modoJuego, cantidadLetras);
    });
    
    $('.modal_resultado .volver_menu').on('click', function () {
        $('.btn-teclado').css('background', '#e5ecf4').removeClass('amarillo verde gris');
        $('.contenedor-juego').css('display', 'none');
        $('.center-container').css('display', 'flex');
        totalPalabrasAcertadas = 0;
    });








    //Animacion dar vuelta input matriz
    function mostrarAnimacionLetrasInout(input) {
        $(input).addClass('flip-animation');
    }

    //Titulo menu juego
    let palabraObjetivo = "APALABRADOS";
    let palabraComparar = "APALAVRADSO";
    let letterBoxes = document.querySelectorAll('.letter-box');

    function animateLetter(pos, colorClass, valorLetra) {
        setTimeout(() => {
            letterBoxes[pos].classList.remove('amarilloMenu', 'grisMenu');
            letterBoxes[pos].classList.add(colorClass);
            letterBoxes[pos].innerHTML = valorLetra;
        }, pos * 280);
    }

    letterBoxes.forEach((contenedorLetra, pos) => {
        let letraObjetivo = palabraObjetivo[pos];
        let letraComparar = palabraComparar[pos];

        setTimeout(() => {
            contenedorLetra.classList.add('animacionTitulo');
            setTimeout(() => {
                if (letraComparar === letraObjetivo) {
                    contenedorLetra.classList.add('verdeMenu');
                } else if (palabraObjetivo.includes(letraComparar)) {
                    contenedorLetra.classList.add('amarilloMenu');
                    animateLetter(pos, 'verdeMenu', letraObjetivo);
                } else {
                    contenedorLetra.classList.add('grisMenu');
                    animateLetter(pos, 'verdeMenu', letraObjetivo);
                }
            }, 1);
        }, pos * 140); //tiempo en caer la letra
    });
    

    $('.btn-meRindo').on('click', function () {
        $('.modal_resultado .modal-title').text("¡Te rendiste!");
        if(modoJuego == modoEmojis) {
            $('.modal_resultado .modal-body .palabra-era').html('<p>La palabra era:</p><p class="font-weight-bold text-uppercase psecreta-modal">' + palabraSecretaEmoji + '</p>');        
        }
        else if (modoJuego == modoPalabras) {
            $('.modal_resultado .modal-body .palabra-era').html('<p>La palabra era:</p><p class="font-weight-bold text-uppercase psecreta-modal">' + palabraSecreta + '</p>');              
        }
        $('.modal_resultado .btn-primary').removeClass('siguiente').addClass('restart').html('Reiniciar');
        $('.modal_resultado').modal('show');

    });
    
    
    
    
  

    
    
  