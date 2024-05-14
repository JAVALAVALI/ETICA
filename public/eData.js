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
    await loadData()
    setInterval(async () => {
        await loadData()
    }, 1000 * 660);//Actualiza información cada 660 segundos
    $("#body").on("click", ".borrar", async (e) => {
        let ID = e.target.id
        let code = parseInt(prompt("Ingrese el código de verificación: "))
        await borrar(ID, code)
    })
})


async function borrar(ID, code) {
    let res = await Send("/api/delete", 'POST', { ID: ID, code: code })
    if (res.msg == 200) {
        alert("Elemento borrado")
        await loadData()
    } else {
        alert(res.msg)
    }
}

async function loadData() {
    var questions, data;
    var cuenta = 0
    //Limpiar tabla
    $("#head").empty()
    $("#body").empty()
    $("#cuenta").empty()
    //Pedir información al servidor
    //Preguntas
    questions = await Send('/api/qAll', 'GET')
    //Respuestas
    data = await Send('/api/rAll', 'GET')

    //Cargar preguntas en el head
    questions.forEach(q => {
        $("#head").append(`<th>${q.q}</th>`)
    });
    $("#head").append(`<th>Borrar</th>`)

    //Mostrar las respuestas en la tabla
    data.forEach((d, index) => {
        cuenta++
        $("#body").append(`<tr id="d${index}"></tr>`)
        d.answer.forEach(q => {
            $(`#d${index}`).append(`<td>${q}</td>`)
        });
        $(`#d${index}`).append(`<td><input type="button" id="${d._id}" class="borrar" value="Borrar"/></td>`)
    });
    $("#cuenta").append(`[${cuenta}]`)
}
