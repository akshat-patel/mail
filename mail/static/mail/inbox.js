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

    const recipients = document.querySelector("#compose-recipients");
    const subject = document.querySelector("#compose-subject");
    const body = document.querySelector("#compose-body");
    const submit = document.querySelector("#submit");

    //   Clear out composition fields
    recipients.value = "";
    subject.value = "";
    body.value = "";

    submit.disabled = true;

    // Make sure that all fields are filled out before submitting
    recipients.onkeyup = () => {
        if (recipients.value.length > 0) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    };

    subject.onkeyup = () => {
        if (subject.value.length > 0) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    };

    body.onkeyup = () => {
        if (body.value.length > 0) {
            submit.disabled = false;
        } else {
            submit.disabled = true;
        }
    };

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
            });

        load_mailbox("sent");
        return false;
    };
}

function load_mailbox(mailbox) {
    // Show the mailbox and hide other views
    document.querySelector("#emails-view").style.display = "block";
    document.querySelector("#compose-view").style.display = "none";

    // Show the mailbox name
    document.querySelector("#emails-view").innerHTML = `<h3>${
        mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }</h3>`;

    if (mailbox === "sent") {
        document.querySelector("#emails-view").innerHTML = ``;
    }
}
