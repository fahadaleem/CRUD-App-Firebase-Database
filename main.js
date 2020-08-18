// create object of dom strings to easily access dom elements.

const domStr = {
    add_user_btn: "#add-user-btn",
    data_table: ".data-table",
    add_user_form: "#add-user-form",
    username_field:"#username",
    email_field:"#email",
    phone_no_field:"#phone-no",
    submit_btn:"#submit",
    table_body:"tbody",
    close_btn:"#close-btn",
    modal_output:"#modal-output",
    output:
    {
        username_display:"#username-display",
        email_display:"#email-display",
        phoneNo_display:"#phoneno-display"
    },
    update_details:
    {
        update_form_modal:"#update-form-modal",
        username_update:"#username-update",
        email_update:"#email-update",
        phone_no_update:"#phone-no-update",
        update_btn:"#update",
        update_form_close_btn:"#update-form-close-btn"
    }

}

const show_add_user_form = ()=>{
    // Hide Table
    
    document.querySelector(domStr.data_table).classList.add("d-none");

    // Display Form

    document.querySelector(domStr.add_user_form).classList.remove("d-none");
}

const show_table= ()=>{
    // Display Table
    
    document.querySelector(domStr.data_table).classList.remove("d-none");

    // Hide Form

    document.querySelector(domStr.add_user_form).classList.add("d-none");
}


const hide_modal = ()=>{
    document.querySelector(domStr.modal_output).classList.add("d-none");
}

const hide_edit_form_modal = ()=>{
    document.querySelector(domStr.update_details.update_form_modal).classList.add("d-none");
}




const checkValidation = (username, email, phoneNo)=>
{
    if(username==="" || email==="" || phoneNo==="")
    {
        alert("Please fill all the fields");
        return false;
    }
    else{
        return true;
    }
}

const getInputs = ()=>{
   const username =  document.querySelector(domStr.username_field).value;
   const email = document.querySelector(domStr.email_field).value;
   const phoneNo = document.querySelector(domStr.phone_no_field).value;

   // Check validation
   const isValidate = checkValidation(username,email,phoneNo);

   // Generate Unique Key
   const key = firebase.database().ref("records").push().key;
   if(isValidate===true)
   {
        return {
            username:username,
            email:email,
            phoneNo:phoneNo,
            key:key,
        }
   }

}


const addUser = (key,obj)=>{
    firebase.database().ref("records").child(key).set(obj);
}

const init = () => {
    let id = 1;
    firebase.database().ref("records").on("child_added", snap => {
        const html = `<tr id="user-${id}">
        <td scope="row">${id++}</td >
        <td>${snap.val().username}</td>
        <td>${snap.val().email}</td>
        <td>${snap.val().phoneNo}</td>
        <td>
            <button type="button" class="btn btn-primary " id="edit${snap.val().key}">Edit</button>
            <button type="button" class="btn btn-warning  " id="view${snap.val().key}">View</button>
            <button type="button" class="btn btn-danger " id="delete${snap.val().key}">Delete</button>
        </td>
    </tr>
        `
        document.querySelector(domStr.table_body).insertAdjacentHTML("beforeend", html);


    });

    // Add event listener add addUserBtn
    document.querySelector(domStr.add_user_btn).addEventListener("click", show_add_user_form);


    // Add Event listener to view modal close btn
    document.querySelector(domStr.close_btn).addEventListener("click", hide_modal);


    // Add Event listener to update form modal close btn
    document.querySelector(domStr.update_details.update_form_close_btn).addEventListener("click", hide_edit_form_modal);

    // Add Evenet listener to update btn
    document.querySelector(domStr.update_details.update_btn).addEventListener("click", updateData);


}

const clear_form_fields = ()=>{
    document.querySelector(domStr.username_field).value="";
    document.querySelector(domStr.email_field).value="";
    document.querySelector(domStr.phone_no_field).value="";
}

// submit button 
document.querySelector(domStr.submit_btn).addEventListener("click", ()=>{
    // Get inputs of the input fields 
    const obj = getInputs();
    // Pass the object key and object to the add user function
    addUser(obj.key, obj);

    // After submission of data the table should shown
    show_table();

    // Clear Input fields
    clear_form_fields();
})


const deleteData = (id)=>{
    
    const userid = id.slice(6,)
    firebase.database().ref("records").child(userid).remove();

    document.querySelector("#"+id).parentNode.parentNode.remove();
    
    
}

const viewData = (id)=>{
    
    const userid = id.slice(id.indexOf("-"),)

    document.querySelector(domStr.modal_output).classList.remove("d-none");

    firebase.database().ref("records").child(userid).on("value", snap=>{
        document.querySelector(domStr.output.username_display).textContent = snap.val().username;
        document.querySelector(domStr.output.email_display).textContent = snap.val().email;
        document.querySelector(domStr.output.phoneNo_display).textContent = snap.val().phoneNo;
    })
}
let id_for_update;

const editData = (id)=>{
    

    // copy the id of data into userid
    const userid = id.slice(id.indexOf("-"),); 
    // Display update form 
    document.querySelector(domStr.update_details.update_form_modal).classList.remove("d-none");

    // fetch the data of given ID
    firebase.database().ref("records").child(userid).on("value", snap=>{
        console.log(snap.val());
        document.querySelector(domStr.update_details.username_update).value = snap.val().username;
        document.querySelector(domStr.update_details.email_update).value = snap.val().email;
        document.querySelector(domStr.update_details.phone_no_update).value = snap.val().phoneNo;
    });

    // Assign user id to the global variable for update the data
    id_for_update = userid;
    
}

const updateData = ()=>{
    // Get inputs of update form

    const username = document.querySelector(domStr.update_details.username_update).value;
    const email = document.querySelector(domStr.update_details.email_update).value;
    const phoneno = document.querySelector(domStr.update_details.phone_no_update).value;

    firebase.database().ref("records").child(id_for_update).update({
        username:username,
        email:email,
        phoneNo:phoneno,
    });

    location.reload();

    // Hide Update Form
    document.querySelector(domStr.update_details.update_form_modal).classList.add("d-none");
    
}

// Add event listener to table body
document.querySelector(domStr.table_body).addEventListener("click", e=>{



    // If delete button clicke, then deleteData() calls
    if(e.target.id.includes("delete"))
    {
        deleteData(e.target.id);
    }
    // If view button clicke, then viewData() calls
    else if(e.target.id.includes("view"))
    {
        viewData(e.target.id);
    }
    // If edit button clicke, then viewData() calls
    else if(e.target.id.includes("edit"))
    {
         editData(e.target.id); 
    }
})


// Start Application
init();
