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
            emails.forEach((email) => {
                if (mailbox === "sent") {
                    document.querySelector("#emails-view").innerHTML += `
                    <div id="${email.id}" class="card bg-light mt-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">To: ${email.recipients}</div>
                                <div class="col-4">${email.subject}</div>
                                <div class="col-4">${email.timestamp}</div>
                            </div>
                        </div>
                    </div>
                    `;
                } else if (mailbox === "inbox" && !email.archived) {
                    //assume the email is unread
                    let readBgColor = "light";
                    if (email.read === true) {
                        readBgColor = "secondary";
                    }
                    document.querySelector("#emails-view").innerHTML += `
                    <div id="${email.id}" class="card bg-${readBgColor} mt-3">
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
                    <div id="${email.id}" class="card bg-${readBgColor} mt-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-4">From: ${email.sender}</div>
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
                    fetch(`/emails/${card.id}`)
                        .then((response) => response.json())
                        .then((email) => {
                            if (!email.read) {
                                fetch(`/emails/${email.id}`, {
                                    method: 'PUT',
                                    body: JSON.stringify({
                                        read: true
                                    })
                                })
                            }
                            document.querySelector("#emails-view").style.display = "none";
                            document.querySelector("#compose-view").style.display = "none";
                            document.querySelector("#view-email").style.display = "block";

                            //show sender, recipients, subject, timestamp, and body
                            if (mailbox === 'inbox') {
                                document.querySelector('#view-email').innerHTML = `
                                <div class="jumbotron">
                                    <h1 class="display-4">${email.subject}</h1>
                                    <p class="lead">${email.body}</p>
                                    <hr class="my-4">
                                    <p class="font-weight-light">From: ${email.sender}</p>
                                    <p class="font-weight-light">To: ${email.recipients}</p>
                                    <p class="font-weight-light">Sent on ${email.timestamp}</p>
                                    <a id="backButton" class="badge badge-light">Back</a>
                                    <a id="archiveButton" class="badge badge-light">Archive</a>
                                </div>
                                `;
                            } else if (mailbox === 'sent') {
                                document.querySelector('#view-email').innerHTML = `
                                <div class="jumbotron">
                                    <h1 class="display-4">${email.subject}</h1>
                                    <p class="lead">${email.body}</p>
                                    <hr class="my-4">
                                    <p class="font-weight-light">From: ${email.sender}</p>
                                    <p class="font-weight-light">To: ${email.recipients}</p>
                                    <p class="font-weight-light">Sent on ${email.timestamp}</p>
                                    <a id="backButton" class="badge badge-light">Back</a>
                                </div>
                                `;
                            } else {
                                //mailbox === 'archive'
                                document.querySelector('#view-email').innerHTML = `
                                <div class="jumbotron">
                                    <h1 class="display-4">${email.subject}</h1>
                                    <p class="lead">${email.body}</p>
                                    <hr class="my-4">
                                    <p class="font-weight-light">From: ${email.sender}</p>
                                    <p class="font-weight-light">To: ${email.recipients}</p>
                                    <p class="font-weight-light">Sent on ${email.timestamp}</p>
                                    <a id="backButton" class="badge badge-light">Back</a>
                                    <a id="archiveButton" class="badge badge-light">Unarchive</a>
                                </div>
                                `;
                            }
                            document.querySelector('#backButton').addEventListener('click', function () {
                                if (mailbox === "inbox") {
                                    load_mailbox("inbox");
                                }
                                else if (mailbox === "sent") {
                                    load_mailbox("sent");
                                }
                                else {
                                    load_mailbox("archive");
                                }
                            });

                            document.querySelector("#archiveButton").addEventListener('click', function () {
                                if (document.querySelector('#archiveButton').innerHTML === 'Unarchive') {
                                    // const requestArchive = async(email.id) => {
                                    //     const response = await fetch(`/emails/${email.id}`);
                                    //     const json = await response.json();
                                    //     console.log('async based');
                                    //     console.log(json);
                                    // }

                                    // requestArchive();
                                    fetch(`/emails/${email.id}`, {
                                        method: 'PUT',
                                        body: JSON.stringify({
                                            archived: false
                                        })
                                    })
                                        .then((response) => {
                                            load_mailbox('inbox');
                                        })
                                } else {
                                    fetch(`/emails/${email.id}`, {
                                        method: 'PUT',
                                        body: JSON.stringify({
                                            archived: true
                                        })
                                    })
                                        .then((response) => {
                                            load_mailbox('inbox');
                                        })
                                }
                            });
                        });
                }
            });
        });
}
