async function cargarJSON(path) {
    //Función para importar los datos del servidor
    try {
        const response = await fetch(path, {
            method: 'GET'
        }); // Asegúrate de poner la ruta correcta del archivo
        if (!response.ok) {
            throw new Error('Error en la red al intentar cargar el archivo');
        }
        const data = await response.json();
        return data; // Retorna los datos JSON
    } catch (error) {
        console.error('Error al cargar o procesar el JSON:', error);
    }
}

async function manejarDatos() {//Asignar las rutas de la API para importar json del server
    const datos = await cargarJSON('/api/rAll');
    const preguntas = await cargarJSON('/api/qAll');
    procesarDatos(datos, preguntas)
}

function procesarDatos(data, questions) {
    $('#resp').empty()
    for (let u = 0; u < questions.length; u++) {
        if (questions[u].cerrada == true) {
            let responseCounts = {};  //Para contar respuestas a preguntas cerradas
            data.forEach(resp => {
                questions[u].options.forEach(carrera => { //Para contar respuestas a preguntas cerradas compuetas
                    if (questions[u].compuesta) {
                        if (resp.answer[u][0] == carrera.toLowerCase()) {
                            if (responseCounts[resp.answer[u][0]]) {
                                responseCounts[resp.answer[u][0]]++;
                            } else {
                                responseCounts[resp.answer[u][0]] = 1;
                            }
                        }
                    } else {//Para contar respuestas a preguntas abiertas de tipo numerico entero
                        if (resp.answer[u] == carrera.toLowerCase()) {
                            if (responseCounts[resp.answer[u]]) {
                                responseCounts[resp.answer[u]]++;
                            } else {
                                responseCounts[resp.answer[u]] = 1;
                            }
                        }
                    }
                });
            });
            //Mostrar tabala de frecuencia
            var $table = $('<table>').addClass('frequencyTable');
            var $thead = $('<thead>').append($('<tr>').append($('<th>').attr('colspan', '2').text(u + ") " + questions[u].q)));
            var $tbody = $('<tbody>');

            $.each(responseCounts, function (response, count) {
                var $row = $('<tr>').append($('<td>').text(response.toUpperCase()), $('<td>').text(count));
                $tbody.append($row);
            });

            $table.append($thead).append($tbody);
            $('#resp').append($table);

        } else if (questions[u].cerrada == false && questions[u].type == "int") {
            let responseCounts = {};
            data.forEach(resp => {
                if (responseCounts[resp.answer[u]]) {
                    responseCounts[resp.answer[u]]++;
                } else {
                    responseCounts[resp.answer[u]] = 1;
                }

            });
            
            //Mostrar tabala de frecuencia
            var $table = $('<table>').addClass('frequencyTable');
            var $thead = $('<thead>').append($('<tr>').append($('<th>').attr('colspan', '2').text(u + ") " +questions[u].q)));
            var $tbody = $('<tbody>');

            $.each(responseCounts, function (response, count) {
                var $row = $('<tr>').append($('<td>').text(response), $('<td>').text(count));
                $tbody.append($row);
            });

            $table.append($thead).append($tbody);
            $('#resp').append($table);
        }
    }
}
$(document).ready(() => {
    manejarDatos();
})

