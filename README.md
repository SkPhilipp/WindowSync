WindowSync
==========

For sending data across browser’s windows and tabs, fully clientside – through localStorage. This library enables you to share data and update browser windows the user has open, using the shared localStorage. Also keeps track of open windows, and assigns an identifier to them.


WindowSync pretty much has only one usecase, send data and handle it in another window.



    <input type="text" id="syncme"/>
    <script>
    $("#syncme").keyup( function() {
        WindowSync.setItem("syncme", $(this).val());
    });
    
    WindowSync.setHandler(function(obj){
        $("#syncme").val(obj.newValue);
    });
    </script>

In this case, when the input#syncme changes, the handler receives it and sets the value to the received value. This will work on any browser with a localStorage implementation. (In this case the same window will set the value to the current value, but that is not an issue as it doesnt trigger a change event.)

A real-world usecase would be for example in a chat application, to not have to receive or pull with multiple windows, but have only one active window receiving and sending chat-messages with the other windows keeping the state in sync using WindowSync.
