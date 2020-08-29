console.log("===Agenda===");

(function () {
    console.log("start app...");
    //user interFace.
    var ui = {
        fields: document.querySelectorAll("input"),
        button: document.querySelector(".pure-button"),
        table: document.querySelector(".pure-table tbody"),
    };
    //actions
    var validateFields = function (e) {
        e.preventDefault();
        //console.log (ui.fields [0].value);

        var errors = 0;
        var contact = {};

        ui.fields.forEach(function (field) {
            //console.log(fields,fields.value);
            if (field.value.length === 0) {
                field.classList.add("error");
                errors++;
            } else {
                field.classList.remove("error");
                contact[field.id] = field.value;
            }
        });
        console.log(errors, contact);
        if (errors === 0) {
            addContact(contact);
        } else {
            document.querySelector(".error").focus();
        }
    };

    var addContact = function (contact) {
        console.log(contact);
        var endpoint = "http://localhost:5000/contatos";
        var config = {
            method: "post",
            body: JSON.stringify(contact),
            headers: new Headers({
                "Content-type": "application/json"
            })
        };

        fetch(endpoint, config)
            .then(getContacts)
            .catch(genericError);

    };

    var genericError = function (error) {
        console.error(error);
    }

    var getContacts = function () {
        var endpoint = "http://localhost:5000/contatos";
        var config = {
            method: "get",
            headers: new Headers({
                "Content-type": "application/json"
            })
        };
        fetch(endpoint, config)
            .then(function (response) { return response.json(); }).then(getContactsSuccess)
            .catch(genericError);
    }

    var getContactsSuccess = function (contacts) {
        var html=[];
        contacts.forEach(function (contact) {
        html.push(`<tr>
        <td>${contact.id}</td>
        <td>${contact.name}</td>
        <td>${contact.email}</td>
        <td>${contact.phone}</td>
        <td><a href="#" data-action="delete" data-id="${contact.id}">Excluir</a></td>
        </tr>`);
    });
        ui.table.innerHTML= html.join("");
    }

    var removeContact = function (e) {
        console.log ( e.target.dataset );
        if(e.target.dataset.action === "delete" && confirm("Desja excluir este item?")){
            var endpoint = `http://localhost:5000/contatos${e.target.dataset.id}`;
            var config = {
                method: "DELETE",
                headers: new Headers({
                    "Content-type": "application/json" 
                })
            };

            fetch(endpoint,config)
            .then(getContacts)
            .catch(genericError);
        }

     };

    var init = function () {
        ui.button.onclick = validateFields;
        getContacts();
        ui.table.onclick=removeContact;
    }();


console.log(ui);
})();
