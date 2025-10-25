
//for sending contact messages

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contactForm')

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim()
        const email = document.getElementById("email").value.trim()
        const message = document.getElementById("message").value.trim()

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/contact-messages`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: {
                        name, email, message
                    }
                })
            })
            if (response.ok) {
                alert("Message sent Succesfully")
                form.reset()
            }
            else {
                alert("Failes to send message.Please try again")
            }
        } catch (error) {
            console.log('Error: ', error);
            alert("Something went wrong")

        }
    })
})