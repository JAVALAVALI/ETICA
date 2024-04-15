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
    $("#opt").on('input', async () => {
        let option = parseInt($("#opt").val())
        await loadData(option)
    })
    await loadData(1)

})

async function loadData(cuestionario) {
    var questions, data
    //Limpiar tabla
    $("#head").empty()
    $("#body").empty()
    //Pedir información dependiendo
    switch (cuestionario) {
        case 1:
            //Etica fetch
            questions = await Send('/api/qEtica', 'GET')
            data = await Send('/api/rEtica', 'GET')
            break;
        case 2:
            //Moral
            questions = await Send('/api/qMoral', 'GET')
            data = await Send('/api/rMoral', 'GET')
            break;
        case 3:
            //Valores
            questions = await Send('/api/qValores', 'GET')
            data = await Send('/api/rValores', 'GET')
            break
        default:
            alert("Invalido")
            break;
    }
    //Cargar preguntas en el head
    questions.forEach(q => {
        $("#head").append(`<th>${q.q}</th>`)
    });
    console.table(data[0].answer);
    data[0].answer.forEach(q => {
        $("#body").append(`<td>${q}</td>`)

    });
}