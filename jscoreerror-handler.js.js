LawOfficeApp.Core.ErrorHandler = {
    handle(userMessage, errorDetails) {
        console.error("System Error Details:", errorDetails);
        LawOfficeApp.UI.Toast.show(userMessage, "error");
    }
};