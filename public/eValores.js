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
    const questions = await Send('/api/qValores', 'GET')
    loadQuesions(questions)
    $('#send').click(async () => {
        try {
            if (confirm("Confirma para enviar formulario")) {
                let formData = []
                for (let i = 0; i < questions.length; i++) {
                    if (questions[i].type == "int") {
                        var valor = $(`#p${i + 1}`).val()
                        formData.push(parseInt(valor))
                    } else {
                        var valor = $(`#p${i + 1}`).val()
                        formData.push(valor)
                    }
                }
                let res = await Send('api/cValores', 'POST', { answer: formData })
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
        if (q.cerrada == true) {
            $('#questions').append(`<label for="p${index + 1}">${index + 1}) ${q.q}</label>`)
            $('#questions').append(`<select id="p${index + 1}"></select>`)
            q.options.forEach(opt => {
                $(`#p${index + 1}`).append(`<option value="${opt}">${opt}</option>`)
            });
        } else {
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