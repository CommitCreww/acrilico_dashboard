const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const erro = document.getElementById("erro");

    erro.innerText = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const data = await response.json();
        console.log("Resposta da API:", data);

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            window.location.href = "dashboard.html";
        } else {
            erro.innerText = data.erro || "Erro no login";
        }

    } catch (error) {
        console.error("Erro ao conectar:", error);
        erro.innerText = "Erro ao conectar com a API";
    }
});