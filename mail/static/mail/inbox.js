document.addEventListener("DOMContentLoaded", function () {
    // Use buttons to toggle between views
    document
        .querySelector("#inbox")
        .addEventListener("click", () => load_mailbox("inbox"));
    document
        .querySelector("#sent")
        .addEventListener("click", () => load_mailbox("sent"));
    document
        .querySelector("#archived")
        .addEventListener("click", () => load_mailbox("archive"));
    document.querySelector("#compose").addEventListener("click", compose_email);

    // By default, load the inbox
    load_mailbox("inbox");
});

function compose_email() {
    // Show compose view and hide other views
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";
    document.querySelector("#view-email").style.display = "none";

    const recipients = document.querySelector("#compose-recipients");
    const subject = document.querySelector("#compose-subject");
    const body = document.querySelector("#compose-body");

    //   Clear out composition fields
    recipients.value = "";
    subject.value = "";
    body.value = "";

    document.querySelector("form").onsubmit = function () {
        const recipients = document.querySelector("#compose-recipients").value;
        const subject = document.querySelector("#compose-subject").value;
        const body = document.querySelector("#compose-body").value;

        fetch("/emails", {
            method: "POST",
            body: JSON.stringify({
                recipients: recipients,
                subject: subject,
                body: body,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                load_mailbox("sent");
            });

        return false;
    };
}

function load_mailbox(mailbox) {
    // Show the mailbox and hide other views
    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#compose-view").style.display = "none";
    document.querySelector("#view-email").style.display = "none";

    // Show the mailbox name
    document.querySelector("#emails-view").innerHTML = `<h3>${
        mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }</h3>`;

    fetch(`/emails/${mailbox}`)
        .then((response) => response.json())
        .then((emails) => {
            console.log(emails);
            emails.forEach((email) => {
                if (mailbox === "sent") {
                    document.querySelector("#emails-view").innerHTML += `
                    <div class="card bg-light mt-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">To: ${email.recipients}</div>
                                <div class="col-4">${email.subject}</div>
                                <div class="col-4">${email.timestamp}</div>
                            </div>
                        </div>
                    </div>
                    `;
                } else if (mailbox === "inbox") {
                    //assume the email is unread
                    let readBgColor = "light";
                    if (email.read === true) {
                        readBgColor = "secondary";
                    }
                    document.querySelector("#emails-view").innerHTML += `
                    <div class="card bg-${readBgColor} mt-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">From: ${email.sender}</div>
                                <div class="col-4">${email.subject}</div>
                                <div class="col-4">${email.timestamp}</div>
                            </div>
                        </div>
                    </div>
                    `;
                } else {
                    //mailbox === "archive"

                    //assume the email is unread
                    let readBgColor = "light";
                    if (email.read === true) {
                        readBgColor = "secondary";
                    }
                    document.querySelector("#emails-view").innerHTML += `
                    <div class="card bg-${readBgColor} mt-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">rom: ${email.sender}</div>
                                <div class="col-4">${email.subject}</div>
                                <div class="col-4">${email.timestamp}</div>
                            </div>
                        </div>
                    </div>
                    `;
                }
            });
            document.querySelectorAll(".card").forEach((card) => {
                card.onclick = () => {
                    console.log(card);
                };
            });
        });
}
