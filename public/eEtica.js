const Send = async (url, method, data) => {
    try {
        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {

            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        try {
            const result = await response.json();
            return result;
        } catch (jsonError) {
            // Devolver la respuesta en formato de texto
            return await response.text();
        }
    } catch (error) {
        console.error("Error in send function:", error);
        throw error;
    }
};

$(document).ready(async () => {
    const questions = await Send('/api/qEtica', 'GET')
    loadQuesions(questions)
    $('#send').click(async () => {
        try {
            if (confirm("Confirma para enviar formulario")) {
                let formData = []
                for (let i = 0; i < questions.length; i++) {
                    //Si una respuesta es del tipo numerica
                    if (questions[i].type == "int") {
                        var valor = $(`#p${i + 1}`).val().toLowerCase()
                        formData.push(parseInt(valor))
                    } else {
                        var valor = $(`#p${i + 1}`).val().toLowerCase()
                        //En caso de que alguna pregunta tenga dos respuestas por se compuestas
                        if ($(`#c${i + 1}`).val()) {
                            var valorC = $(`#c${i + 1}`).val().toLowerCase()
                            formData.push([valor, valorC])
                        } else {
                            //En caso de que la respuesta se a una pregunta abierta normal
                            formData.push(valor)
                        }
                    }
                }
                //Logica para enviar la información al servidor
                let res = await Send('api/cEtica', 'POST', { answer: formData })
                if (res.msg == 200) {
                    alert("Información guardada correctamente.")
                    loadQuesions(questions)
                } else {
                    alert("No se guardo!!")
                }
            }
        } catch (error) {
            console.log(error);
        }
    })

})
//Función que carga las preguntas en el DOM y que tiene por parametro un array con las preguntas
function loadQuesions(questions) {
    $('#questions').empty()
    questions.forEach((q, index) => {
        //Carga las preguntas cerradas con su respectivas opciones
        if (q.cerrada == true && q.type != "parrafo" && !q.compuesta) {
            $('#questions').append(`<label for="p${index + 1}">${index + 1}) ${q.q}</label>`)
            $('#questions').append(`<select id="p${index + 1}"></select>`)
            q.options.forEach(opt => {
                $(`#p${index + 1}`).append(`<option value="${opt}">${opt}</option>`)
            });
        }//Para cargar preguntas compuestas
        else if (q.compuesta) {
            //Primero cargamos la pregunta cerrada con sus respectiva opciones
            $('#questions').append(`<label for="p${index + 1}">${index + 1}) ${q.q}</label>`)
            $('#questions').append(`<select id="p${index + 1}"></select>`)
            q.options.forEach(opt => {
                $(`#p${index + 1}`).append(`<option value="${opt}">${opt}</option>`)
            });
            //Luego cargamos la pregunta abierta con el input correspondiente
            //Carga las preguntas abiertas de tipo texto o numero. su id sera c[el index de la pregunta]
            $('#questions').append(`<label for="c${index + 1}">${q.compuesta.q}</label>`)
            if (q.compuesta.type == "text") {
                $('#questions').append(`<input id="c${index + 1}" type="text"></input>`)
            } else {
                $('#questions').append(`<input id="c${index + 1}" type="number" min="0"></input>`)
            }
        }
        //Para cargar textos dentro del cuestionario
        else if (q.type == "parrafo") {
            $('#questions').append(`<p>${q.options[0]}</p>`)
        }
        else {
            //Carga las preguntas abiertas de tipo texto o numero
            $('#questions').append(`<label for="p${index + 1}">${index + 1}) ${q.q}</label>`)
            if (q.type == "text") {
                $('#questions').append(`<input id="p${index + 1}" type="text"></input>`)
            } else {
                $('#questions').append(`<input id="p${index + 1}" type="number" min="0"></input>`)
            }
        }
    })
}